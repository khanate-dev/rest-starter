import { verifyJwt } from '~/helpers/jwt';
import { getErrorResponse } from '~/helpers/error';

import { reIssueAccessToken } from '~/controllers/session';

import { AuthenticatedMiddleware, Status } from '~/types';

const validateAuth: AuthenticatedMiddleware = async (
	{ headers },
	response,
	next
) => {
	try {

		const accessToken = headers.authorization?.replace(/^Bearer\s/, '') ?? '';
		const refreshToken = headers['x-refresh'];

		if (!accessToken) throw new Error('You are not logged in');

		const { decoded, valid, expired } = verifyJwt(accessToken);

		if (!valid && !expired) {
			throw new Error('Invalid login session');
		}

		if (decoded) response.locals.user = decoded;

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
			response.locals.user = decoded;

		}

		return next();

	}
	catch (error: any) {
		const json = getErrorResponse(error);
		return response.status(Status.UNAUTHORIZED).json(json);
	}
};

export default validateAuth;