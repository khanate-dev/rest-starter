import jwt from 'jsonwebtoken';

import { config } from '~/config';
import { getErrorResponseAndCode } from '~/helpers/error';
import { STATUS } from '~/helpers/http';
import { mongoIdSchema } from '~/helpers/schema';
import { userSansPasswordSchema } from '~/schemas/user';
import { findSessionById } from '~/services/session';
import { findUserById } from '~/services/user';

import type { Request, Response } from 'express';
import type { z } from 'zod';
import type { UserRole } from '~/schemas/user';

export const JWT_SCHEMA = userSansPasswordSchema.extend({
	id: mongoIdSchema,
	sessionId: mongoIdSchema,
});

export type Jwt = z.infer<typeof JWT_SCHEMA>;

export const signJwt = (object: Jwt, options?: jwt.SignOptions) => {
	return jwt.sign(object, config.privateKey, {
		...options,
		algorithm: 'RS256',
	});
};

export type JwtVerification =
	| { valid: false; expired: boolean }
	| { valid: true; payload: Jwt };

export const verifyJwt = (token: string): JwtVerification => {
	try {
		const payload = JWT_SCHEMA.parse(jwt.verify(token, config.publicKey));
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
): Promise<Jwt> => {
	const refreshHeader = headers['x-refresh'];
	const refreshToken = verifyJwt(
		(Array.isArray(refreshHeader) ? refreshHeader[0] : refreshHeader) ?? '',
	);
	if (!refreshToken.valid && refreshToken.expired)
		throw new Error('Refresh token expired');
	if (!refreshToken.valid) throw new Error('Invalid refresh token');

	const session = await findSessionById(refreshToken.payload.sessionId);
	if (!session?.valid) throw new Error('Session is no longer valid');

	const user = await findUserById(session.userId);
	if (!user) throw new Error('user not found');

	const payload: Jwt = {
		...user,
		sessionId: session.id,
	};
	const accessToken = signJwt(payload, { expiresIn: config.refreshTokenAge });
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
			return response.status(STATUS.forbidden).json({
				message: 'You do not have access to this resource',
				type: 'unauthorized',
			});
		}
	} catch (error) {
		const { status, json } = getErrorResponseAndCode(
			error,
			STATUS.unauthorized,
		);
		return response.status(status).json(json);
	}
};
