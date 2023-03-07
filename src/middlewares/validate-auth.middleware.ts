import { ApiError } from '~/errors';
import { getErrorResponseAndCode } from '~/helpers/error';
import { signJwt, verifyJwt } from '~/helpers/jwt';
import { STATUS } from '~/helpers/http';
import { findSessionById, findUserById } from '~/services';
import { CONFIG } from '~/config';

import type { Jwt } from '~/helpers/jwt';
import type { AuthenticatedMiddleware, AuthenticatedRoute } from '~/types';

const reIssueAccessToken: (
	...params: Parameters<AuthenticatedMiddleware>
) => Promise<Jwt> = async ({ headers }, response) => {
	const refreshHeader = headers['x-refresh'];
	const refreshToken = verifyJwt(
		(Array.isArray(refreshHeader) ? refreshHeader[0] : refreshHeader) ?? ''
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
	const accessToken = signJwt(payload, { expiresIn: CONFIG.refreshTokenAge });
	response.setHeader('x-access-token', accessToken);
	return payload;
};

export const validateAuth =
	(route: AuthenticatedRoute): AuthenticatedMiddleware =>
	async (request, response, next) => {
		try {
			const verification = verifyJwt(
				request.headers.authorization?.replace(/^Bearer\s/u, '') ?? ''
			);

			if (!verification.valid && !verification.expired)
				throw new Error('Invalid or missing access token');

			const user = !verification.valid
				? await reIssueAccessToken(request, response, next)
				: verification.payload;

			// eslint-disable-next-line require-atomic-updates
			response.locals.user = user;

			const availableTo = route.availableTo
				? Array.isArray(route.availableTo)
					? route.availableTo
					: [route.availableTo]
				: [];

			if (availableTo.length > 0 && !availableTo.includes(user.role))
				throw new ApiError(
					STATUS.forbidden,
					'You do not have access to this resource'
				);

			next();
			return;
		} catch (error: any) {
			const { status, json } = getErrorResponseAndCode(
				error,
				STATUS.unauthorized
			);
			return response.status(status).json(json);
		}
	};
