import { verifyJwt } from '~/helpers/jwt';
import { getErrorResponseAndCode } from '~/helpers/error';
import { ApiError } from '~/errors';

import { reIssueAccessToken } from '~/controllers/session';

import {
	AuthenticatedMiddleware,
	AuthenticatedRoute,
	Status,
	Jwt,
} from '~/types';

const validateAuth = (
	route: AuthenticatedRoute
): AuthenticatedMiddleware => async (
	{ headers },
	response,
	next
) => {
		try {

			const accessToken = headers.authorization?.replace(/^Bearer\s/, '') ?? '';
			const refreshToken = headers['x-refresh'];
			let user: Jwt | undefined = undefined;

			if (!accessToken) throw new Error('You are not logged in');

			const { decoded, valid, expired } = verifyJwt(accessToken);

			if (!valid && !expired) {
				throw new Error('Invalid login session');
			}
			if (decoded) user = decoded;

			if (expired) {

				if (!refreshToken) throw new Error('Login session has expired');

				const newAccessToken = await reIssueAccessToken(
					Array.isArray(refreshToken)
						? refreshToken[0] ?? ''
						: refreshToken
				);

				const { decoded } = verifyJwt(newAccessToken);
				if (!decoded) throw new Error('Failed to reissue access token. Please Login again');

				response.setHeader('x-access-token', newAccessToken);
				user = decoded;

			}

			const availableTo = (
				route.availableTo
					? Array.isArray(route.availableTo)
						? route.availableTo
						: [route.availableTo]
					: []
			);

			if (
				availableTo.length > 0
				&& user
				&& !availableTo.includes(user.role)
			) {
				throw new ApiError(
					Status.FORBIDDEN,
					'You do not have access to this resource'
				);
			}

			response.locals.user = user;
			return next();

		}
		catch (error: any) {
			const { status, json } = getErrorResponseAndCode(error, Status.UNAUTHORIZED);
			return response.status(status).json(json);
		}
	};

export default validateAuth;