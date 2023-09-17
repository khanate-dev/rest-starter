import { initContract } from '@ts-rest/core';
import { initServer } from '@ts-rest/express';
import { z } from 'zod';

import { config } from '~/config.js';
import {
	createJwt,
	getLocalUser,
	validatedHandler,
} from '~/helpers/auth.helpers.js';
import { comparePassword } from '~/helpers/crypto.helpers.js';
import { httpStatus } from '~/helpers/http.helpers.js';
import { omit } from '~/helpers/object.helpers.js';
import { prisma } from '~/prisma-client.js';
import { sessionSchema } from '~/schemas/session.schemas.js';

import type { JwtPayload } from '~/helpers/auth.helpers.js';

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
		path: '/session',
		body: z.strictObject({}),
		responses: {
			200: z.strictObject({ accessToken: z.null(), refreshToken: z.null() }),
		},
	},
	post: {
		method: 'POST',
		path: '/session',
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
	get: validatedHandler(async ({ res }) => {
		const userId = getLocalUser(res).id;
		const body = await prisma.session.findMany({
			where: { user_id: userId, valid: true },
		});
		return { status: 200, body };
	}),
	delete: validatedHandler(async ({ res }) => {
		const id = getLocalUser(res).session_id;
		await prisma.session.update({
			data: { valid: false },
			where: { id },
		});
		return { status: 200, body: { accessToken: null, refreshToken: null } };
	}),
	post: async ({ body, headers }) => {
		const user = await prisma.user.findUnique({ where: { email: body.email } });

		if (!user || !comparePassword(body.password, user.password))
			return { status: httpStatus.unauthorized, body: null };

		const session = await prisma.session.create({
			data: { user_agent: headers['user-agent'], user_id: user.id },
		});

		const payload: JwtPayload = {
			...omit(user, 'password'),
			session_id: session.id,
		};

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
