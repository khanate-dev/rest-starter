import { z } from 'zod';

import { config } from '~/config';
import { ApiError } from '~/errors';
import { signJwt } from '~/helpers/auth';
import { STATUS } from '~/helpers/http';
import { createContract, createRoutes } from '~/helpers/route';
import { sessionSchema } from '~/schemas/session';
import { createSession, findSessions, updateSession } from '~/services/session';
import { validatePassword } from '~/services/user';

import type { Jwt } from '~/helpers/auth';

const sessionContract = createContract({
	get: {
		method: 'get',
		path: '/',
		auth: true,
		response: z.array(sessionSchema),
	},
	delete: {
		method: 'delete',
		path: '/:id',
		auth: true,
		availableTo: 'admin',
		params: { id: 'string' },
		response: z.strictObject({ accessToken: z.null(), refreshToken: z.null() }),
	},
	post: {
		method: 'post',
		path: '/',
		body: z.strictObject({
			email: z.string().email(),
			password: z.string(),
		}),
		response: z.strictObject({
			accessToken: z.string(),
			refreshToken: z.string(),
		}),
	},
});

export const sessionRoutes = createRoutes(sessionContract, {
	get: async ({ locals }) => {
		const userId = locals.user.id;
		return findSessions({
			userId,
			valid: true,
		});
	},
	delete: async ({ locals }) => {
		const updatedSession = await updateSession(locals.user.sessionId, {
			valid: false,
		});
		if (!updatedSession) throw new ApiError(STATUS.notFound);
		return { accessToken: null, refreshToken: null };
	},
	post: async ({ body, headers }) => {
		const user = await validatePassword(body);

		if (!user)
			throw new ApiError(STATUS.unauthorized, 'Invalid email or password');

		const session = await createSession(user.id, headers['user-agent']);

		const token: Jwt = { ...user, sessionId: session.id };

		const accessToken = signJwt(token, { expiresIn: config.accessTokenAge });
		const refreshToken = signJwt(token, { expiresIn: config.refreshTokenAge });

		return {
			json: { accessToken, refreshToken },
			status: STATUS.created,
		};
	},
});
