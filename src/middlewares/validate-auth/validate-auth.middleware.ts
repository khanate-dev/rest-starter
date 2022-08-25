import { verifyJwt } from '~/helpers/jwt';

import { reIssueAccessToken } from '~/controllers/session';

import { ProtectedHandler } from '~/types/general';


const validateAuth: ProtectedHandler = async (
	request,
	response,
	next
) => {
	const accessToken = request.headers.authorization?.replace(/^Bearer\s/, '') ?? '';
	const refreshToken = request.headers['x-refresh'];
	if (!accessToken) return next();
	const { decoded, valid, expired } = verifyJwt(accessToken);

	if (decoded) {
		response.locals.user = decoded;
	}

	if (!valid && !expired) {
		return response.status(409).send('You are not logged in');
	}

	if (expired) {
		try {
			if (!refreshToken) throw new Error('no refresh token');
			console.log(refreshToken);
			const newAccessToken = await reIssueAccessToken(
				Array.isArray(refreshToken)
					? refreshToken[0] ?? ''
					: refreshToken
			);
			if (!newAccessToken) throw new Error('failed to reissue access token');
			response.setHeader('x-access-token', newAccessToken);
			const { decoded } = verifyJwt(newAccessToken);
			if (decoded) {
				response.locals.user = decoded;
			}
		}
		catch (error: any) {
			return response.status(409).send(`Login expired! ${error.message}`);
		}
	}

	return next();

};

export default validateAuth;