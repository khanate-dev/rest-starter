import { initContract } from '@ts-rest/core';
import { initServer } from '@ts-rest/express';
import { z } from 'zod';

import { config } from '~/config';
import { createJwt, jwtPayloadSchema } from '~/helpers/auth';
import { httpStatus } from '~/helpers/http';
import { sessionSchema } from '~/schemas/session';
import { createSession, findSessions, updateSession } from '~/services/session';
import { validatePassword } from '~/services/user';

import type { JwtPayload } from '~/helpers/auth';

const c = initContract();
const r = initServer();

export const sessionContract = c.router({
	get: {
		method: 'GET',
		path: '/session',
		responses: {
			200: z.array(sessionSchema),
		},
	},
	delete: {
		method: 'DELETE',
		path: '/session/:id',
		pathParams: z.strictObject({ id: z.string() }),
		body: z.undefined(),
		responses: {
			200: z.strictObject({ accessToken: z.null(), refreshToken: z.null() }),
			404: z.null(),
		},
	},
	post: {
		method: 'POST',
		path: '/',
		body: z.strictObject({
			email: z.string().email(),
			password: z.string(),
		}),
		responses: {
			201: z.strictObject({
				accessToken: z.string(),
				refreshToken: z.string(),
			}),
			401: z.null(),
		},
	},
});

export const sessionRouter = r.router(sessionContract, {
	get: async ({ res }) => {
		const userId = jwtPayloadSchema.parse(res.locals.user).id;
		const body = await findSessions({
			user_id: userId,
			valid: true,
		});
		return { status: 200, body };
	},
	delete: async ({ res }) => {
		const sessionId = jwtPayloadSchema.parse(res.locals.user).session_id;
		const updatedSession = await updateSession(sessionId, {
			valid: false,
		});
		if (!updatedSession) return { status: 404, body: null };
		return { status: 200, body: { accessToken: null, refreshToken: null } };
	},
	post: async ({ body, headers }) => {
		const user = await validatePassword(body);

		if (!user) return { status: httpStatus.unauthorized, body: null };

		const session = await createSession(user.id, headers['user-agent']);

		const payload: JwtPayload = { ...user, session_id: session.id };

		const accessToken = createJwt(payload);
		const refreshToken = createJwt(payload, {
			expiresIn: config.refreshTokenAge,
		});

		return {
			status: 201,
			body: { accessToken, refreshToken },
		};
	},
});
