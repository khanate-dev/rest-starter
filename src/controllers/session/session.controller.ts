import { CONFIG } from '~/config';
import { ApiError } from '~/errors';
import { signJwt } from '~/helpers/jwt';
import { createSession, findSessions, updateSession } from '~/services/session';
import { validatePassword } from '~/services/user';
import { STATUS } from '~/helpers/http';

import type { Jwt } from '~/helpers/jwt';
import type { AuthenticatedHandler, UnAuthenticatedHandler } from '~/types';
import type {
	CreateSessionSchema,
	DeleteSessionSchema,
	GetSessionsSchema,
} from '~/schemas/session';

export const createSessionHandler: UnAuthenticatedHandler<
	CreateSessionSchema
> = async (request) => {
	const user = await validatePassword(request.body);

	if (!user)
		throw new ApiError(STATUS.unauthorized, 'Invalid email or password');

	const session = await createSession(user.id, request.get('user-agent') ?? '');

	const token: Jwt = {
		...user,
		sessionId: session.id,
	};

	const accessToken = signJwt(token, { expiresIn: CONFIG.accessTokenAge });

	const refreshToken = signJwt(token, { expiresIn: CONFIG.refreshTokenAge });

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
	const userId = response.locals.user.id;
	return findSessions({
		userId,
		valid: true,
	});
};

export const deleteSessionHandler: AuthenticatedHandler<
	DeleteSessionSchema
> = async (_request, response) => {
	const updatedSession = await updateSession(response.locals.user.sessionId, {
		valid: false,
	});
	if (!updatedSession) throw new ApiError(STATUS.notFound);
	return { accessToken: null, refreshToken: null };
};
