import config from '~/config';
import { ApiError } from '~/errors';

import { signJwt, verifyJwt } from '~/helpers/jwt';
import { assertJwt } from '~/helpers/type';

import { SessionModel, SessionWithId } from '~/models/session';

import { CreateSessionInput } from '~/schemas/session';

import { createSession, findSessions, updateSession } from '~/services/session';
import { findUser, validatePassword } from '~/services/user';

import { DefaultRequest, PrivateHandler, PublicHandler, Status } from '~/types';

const accessExpiresIn = config.accessTokenAge;
const refreshExpiresIn = config.refreshTokenAge;

interface Tokens {
	accessToken: string,
	refreshToken: string,
}

interface ClearedTokens {
	accessToken: null,
	refreshToken: null,
}

export const createSessionHandler: PublicHandler<
	CreateSessionInput,
	Tokens
> = async (request) => {

	const user = await validatePassword(request.body);

	if (!user) {
		throw new ApiError(
			Status.UNAUTHORIZED,
			'Invalid email or password'
		);
	}

	const session = await createSession(
		user._id,
		request.get('user-agent') ?? ''
	);

	const accessToken = signJwt(
		{
			...user,
			session: session._id,
		},
		{ expiresIn: accessExpiresIn }
	);

	const refreshToken = signJwt(
		{
			...user,
			session: session._id,
		},
		{ expiresIn: refreshExpiresIn }
	);

	return {
		status: Status.CREATED,
		json: {
			accessToken,
			refreshToken,
		},
	};

};

export const getSessionsHandler: PrivateHandler<
	DefaultRequest,
	SessionWithId[]
> = async (_request, response) => {
	const userId = response.locals.user._id;
	const sessions = await findSessions({
		user: userId,
		valid: true,
	});
	return sessions;
};

export const deleteSessionHandler: PrivateHandler<
	DefaultRequest,
	ClearedTokens
> = async (_request, response) => {

	const sessionId = response.locals.user.session;
	const updatedSession = await updateSession(
		{ _id: sessionId },
		{ valid: false }
	);

	if (!updatedSession.matchedCount) throw new ApiError(Status.NOT_FOUND);

	return {
		accessToken: null,
		refreshToken: null,
	};

};

export const reIssueAccessToken = async (
	refreshToken: string
): Promise<string> => {

	const { decoded, expired } = await verifyJwt(refreshToken);

	if (expired) throw new Error('refresh token expired');
	assertJwt(decoded);

	const session = await SessionModel.findById(decoded.session);
	if (!session?.valid) throw new Error('session is no longer valid');

	const user = await findUser({
		_id: session.user,
	});
	if (!user) throw new Error('user not found');

	const accessToken = signJwt(
		{
			...user,
			session: session._id,
		},
		{ expiresIn: refreshExpiresIn }
	);

	return accessToken;

};