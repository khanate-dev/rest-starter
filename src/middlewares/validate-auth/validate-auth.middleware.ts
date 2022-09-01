import { RequestHandler } from 'express';

import { verifyJwt } from '~/helpers/jwt';
import { getErrorResponseAndCode } from '~/helpers/error';
import logger from '~/helpers/logger';

import { reIssueAccessToken } from '~/controllers/session';

import { Status } from '~/types';

const validateAuth: RequestHandler = async (
	{ headers },
	response,
	next
) => {
	try {

		const accessToken = headers.authorization?.replace(/^Bearer\s/, '') ?? '';
		const refreshToken = headers['x-refresh'];

		if (!accessToken) throw new Error('You are not logged in');

		const { decoded, valid, expired } = verifyJwt(accessToken);

		if ((!valid && !expired) || !decoded) {
			throw new Error('Invalid login session');
		}

		response.locals.user = decoded;

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
		logger.error(error);
		const { status, json } = getErrorResponseAndCode(error, Status.UNAUTHORIZED);
		return response.status(status).json(json);
	}
};

export default validateAuth;