import { RequestHandler } from 'express';
import config from 'config';

import { signJwt, verifyJwt } from '~/helpers/jwt';
import logger from '~/helpers/logger';
import { assertJwt } from '~/helpers/type';

import { SessionModel } from '~/models/session';

import { CreateSessionInput } from '~/schemas/session';

import { createSession, findSessions, updateSession } from '~/services/session';
import { findUser, validatePassword } from '~/services/user';

import { ProtectedHandler } from '~/types/general';

const accessExpiresIn = config.get<string>('accessTokenTtl');
const refreshExpiresIn = config.get<string>('refreshTokenTtl');

export const createSessionHandler: RequestHandler<any, any, CreateSessionInput['body']> = async (
	request,
	response
) => {
	try {
		const user = await validatePassword(request.body);
		if (!user) {
			return response.status(401).send('Invalid email or password');
		}

		const session = await createSession(user._id, request.get('user-agent') ?? '');

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

		return response.send({
			accessToken,
			refreshToken,
		});
	}
	catch (error: any) {
		logger.error(error);
		return response.status(409).send(error.message ?? error);
	}
};

export const getSessionsHandler: ProtectedHandler = async (
	_request,
	response
) => {
	try {
		const userId = response.locals.user._id;
		const sessions = await findSessions({
			user: userId,
			valid: true,
		});
		return response.send(sessions);
	}
	catch (error: any) {
		logger.error(error);
		return response.status(409).send(error.message ?? error);
	}
};

export const deleteSessionHandler: ProtectedHandler = async (
	_request,
	response
) => {
	const sessionId = response.locals.user.session;
	await updateSession(
		{ _id: sessionId },
		{ valid: false }
	);
	return response.send({
		accessToken: null,
		refreshToken: null,
	});
};

export const reIssueAccessToken = async (
	refreshToken: string
) => {

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