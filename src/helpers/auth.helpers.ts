import { default as jwt } from 'jsonwebtoken';

import { config } from '~/config.js';
import { getCatchMessage } from '~/errors.js';
import { httpStatus } from '~/helpers/http.helpers.js';
import { dbIdSchema } from '~/helpers/schema.helpers.js';
import { prisma } from '~/prisma-client.js';
import { userSansPasswordSchema } from '~/schemas/user.schemas.js';

import type { AppRoute } from '@ts-rest/core';
import type { AppRouteOptions } from '@ts-rest/express';
import type { Request, RequestHandler, Response } from 'express';
import type { SignOptions } from 'jsonwebtoken';
import type { z } from 'zod';
import type { UserRole } from '~/schemas/user.schemas.js';

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
		const decoded = jwt.verify(token, config.publicKey);
		const payload = jwtPayloadSchema.strip().parse(decoded);
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

	const session = await prisma.session.findUnique({
		where: { id: refreshToken.payload.session_id },
	});
	if (!session?.valid) throw new Error('Session is no longer valid');

	const user = await prisma.user.findUnique({ where: { id: session.user_id } });
	if (!user) throw new Error('user not found');

	const payload: JwtPayload = {
		...user,
		session_id: session.id,
	};
	const accessToken = createJwt(payload, { expiresIn: config.refreshTokenAge });
	response.setHeader('x-access-token', accessToken);
	return payload;
};

export const validateAuth = (
	availableTo?: UserRole | UserRole[],
): RequestHandler => {
	return async (request, response, next) => {
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

			const authArray = availableTo
				? Array.isArray(availableTo)
					? availableTo
					: [availableTo]
				: [];

			if (authArray.length > 0 && !authArray.includes(user.role)) {
				return response.status(httpStatus.forbidden).json({
					message: 'You do not have access to this resource',
					type: 'unauthorized',
				});
			}
			next();
		} catch (error) {
			return response
				.status(httpStatus.unauthorized)
				.json(getCatchMessage(error));
		}
	};
};

export const validatedHandler = <T extends AppRoute>(
	handler: AppRouteOptions<T>['handler'],
): AppRouteOptions<T> => {
	return { middleware: [validateAuth()], handler };
};

export const getLocalUser = (response: Response) => {
	if (!response.locals.user) throw new Error('No user found');
	return response.locals.user;
};
