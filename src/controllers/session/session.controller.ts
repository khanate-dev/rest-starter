import { CONFIG } from '~/config';
import { ApiError } from '~/errors';
import { signJwt, verifyJwt } from '~/helpers/jwt';
import { assertJwt } from '~/helpers/type';
import {
	createSession,
	findSessionById,
	findSessions,
	updateSession,
} from '~/services/session';
import { findUser, validatePassword } from '~/services/user';
import { STATUS } from '~/types';

import type {
	Jwt,
	AuthenticatedHandler,
	UnAuthenticatedHandler,
} from '~/types';
import type {
	CreateSessionSchema,
	DeleteSessionSchema,
	GetSessionsSchema,
} from '~/schemas/session';

const { accessTokenAge, refreshTokenAge } = CONFIG;

export const createSessionHandler: UnAuthenticatedHandler<
	CreateSessionSchema
> = async (request) => {
	const user = await validatePassword(request.body);

	if (!user)
		throw new ApiError(STATUS.unauthorized, 'Invalid email or password');

	const session = await createSession(
		user._id,
		request.get('user-agent') ?? ''
	);

	const token: Jwt = {
		...user,
		_id: user._id.toJSON(),
		session: session._id.toJSON(),
	};

	const accessToken = signJwt(token, { expiresIn: accessTokenAge });

	const refreshToken = signJwt(token, { expiresIn: refreshTokenAge });

	return {
		json: {
			accessToken,
			refreshToken,
		},
		status: STATUS.created,
	};
};

export const getSessionsHandler: AuthenticatedHandler<
	GetSessionsSchema
> = async (_request, response) => {
	const userId = response.locals.user._id;
	const sessions = await findSessions({
		user: userId,
		valid: true,
	});
	return sessions;
};

export const deleteSessionHandler: AuthenticatedHandler<
	DeleteSessionSchema
> = async (_request, response) => {
	const sessionId = response.locals.user.session;
	const updatedSession = await updateSession(
		{ _id: sessionId },
		{ valid: false }
	);

	if (!updatedSession) throw new ApiError(STATUS.notFound);

	return {
		accessToken: null,
		refreshToken: null,
	};
};

export const reIssueAccessToken = async (
	refreshToken: string
): Promise<string> => {
	const { decoded, expired } = verifyJwt(refreshToken);

	if (expired) throw new Error('refresh token expired');
	assertJwt(decoded);

	const session = await findSessionById(decoded.session);
	if (!session?.valid) throw new Error('session is no longer valid');

	const user = await findUser({
		_id: session.user,
	});
	if (!user) throw new Error('user not found');

	const accessToken = signJwt(
		{
			...user,
			_id: user._id.toJSON(),
			session: session._id.toJSON(),
		},
		{ expiresIn: refreshTokenAge }
	);

	return accessToken;
};
