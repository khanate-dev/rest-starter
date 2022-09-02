import config from '~/config';
import { ApiError } from '~/errors';

import { signJwt, verifyJwt } from '~/helpers/jwt';
import { assertJwt } from '~/helpers/type';

import {
	CreateSessionSchema,
	DeleteSessionSchema,
	GetSessionsSchema,
} from '~/schemas/session';

import {
	createSession,
	findSessionById,
	findSessions,
	updateSession,
} from '~/services/session';
import { findUser, validatePassword } from '~/services/user';

import {
	Jwt,
	PrivateHandler,
	PublicHandler,
	Status,
} from '~/types';

const {
	accessTokenAge,
	refreshTokenAge,
} = config;

export const createSessionHandler: PublicHandler<CreateSessionSchema> = async (
	request
) => {

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

	const token: Jwt = {
		...user,
		_id: user._id.toJSON(),
		session: session._id.toJSON(),
	};

	const accessToken = signJwt(
		token,
		{ expiresIn: accessTokenAge }
	);

	const refreshToken = signJwt(
		token,
		{ expiresIn: refreshTokenAge }
	);

	return {
		status: Status.CREATED,
		json: {
			accessToken,
			refreshToken,
		},
	};

};

export const getSessionsHandler: PrivateHandler<GetSessionsSchema> = async (
	_request,
	response
) => {
	const userId = response.locals.user._id;
	const sessions = await findSessions({
		user: userId,
		valid: true,
	});
	return sessions;
};

export const deleteSessionHandler: PrivateHandler<DeleteSessionSchema> = async (
	_request,
	response
) => {

	const sessionId = response.locals.user.session;
	const updatedSession = await updateSession(
		{ _id: sessionId },
		{ valid: false }
	);

	if (!updatedSession) throw new ApiError(Status.NOT_FOUND);

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