import { default as jwt } from 'jsonwebtoken';

import { config } from '~/config';
import { getCatchMessage } from '~/errors';
import { httpStatus } from '~/helpers/http';
import { dbIdSchema } from '~/helpers/schema';
import { userSansPasswordSchema } from '~/schemas/user';
import { findSessionById } from '~/services/session';
import { findUserById } from '~/services/user';

import type { Request, Response } from 'express';
import type { SignOptions } from 'jsonwebtoken';
import type { z } from 'zod';
import type { UserRole } from '~/schemas/user';

export const jwtPayloadSchema = userSansPasswordSchema.extend({
	id: dbIdSchema,
	session_id: dbIdSchema,
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

export const createJwt = (payload: JwtPayload, options?: SignOptions) => {
	return jwt.sign(payload, config.privateKey, {
		algorithm: 'RS256',
		expiresIn: config.accessTokenAge,
		...options,
	});
};

export type JwtVerification =
	| { valid: false; expired: boolean }
	| { valid: true; payload: JwtPayload };

export const verifyJwt = (token: string): JwtVerification => {
	try {
		const payload = jwtPayloadSchema.parse(jwt.verify(token, config.publicKey));
		return { payload, valid: true };
	} catch (error) {
		return {
			expired: error instanceof Error && error.message === 'jwt expired',
			valid: false,
		};
	}
};

const reIssueAccessToken = async (
	{ headers }: Request,
	response: Response,
): Promise<JwtPayload> => {
	const refreshHeader = headers['x-refresh'];
	const refreshToken = verifyJwt(
		(Array.isArray(refreshHeader) ? refreshHeader[0] : refreshHeader) ?? '',
	);
	if (!refreshToken.valid && refreshToken.expired)
		throw new Error('Refresh token expired');
	if (!refreshToken.valid) throw new Error('Invalid refresh token');

	const session = await findSessionById(refreshToken.payload.session_id);
	if (!session?.valid) throw new Error('Session is no longer valid');

	const user = await findUserById(session.user_id);
	if (!user) throw new Error('user not found');

	const payload: JwtPayload = {
		...user,
		session_id: session.id,
	};
	const accessToken = createJwt(payload, { expiresIn: config.refreshTokenAge });
	response.setHeader('x-access-token', accessToken);
	return payload;
};

export const validateAuth = async (
	request: Request,
	response: Response,
	availableTo?: UserRole | UserRole[],
) => {
	try {
		const verification = verifyJwt(
			request.headers.authorization?.replace(/^Bearer\s/u, '') ?? '',
		);

		if (!verification.valid && !verification.expired)
			throw new Error('Invalid or missing access token');

		const user = !verification.valid
			? await reIssueAccessToken(request, response)
			: verification.payload;

		response.locals.user = user;

		const availableToArray = availableTo
			? Array.isArray(availableTo)
				? availableTo
				: [availableTo]
			: [];

		if (availableToArray.length > 0 && !availableToArray.includes(user.role)) {
			return response.status(httpStatus.forbidden).json({
				message: 'You do not have access to this resource',
				type: 'unauthorized',
			});
		}
	} catch (error) {
		return response
			.status(httpStatus.unauthorized)
			.json(getCatchMessage(error));
	}
};
