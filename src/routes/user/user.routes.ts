import { initContract } from '@ts-rest/core';
import { initServer } from '@ts-rest/express';
import { z } from 'zod';

import { userSansMetaSchema, userSansPasswordSchema } from '~/schemas/user';
import { createUser, findUserById, findUsers } from '~/services/user';

const c = initContract();
const r = initServer();

export const userContract = c.router(
	{
		get: {
			method: 'GET',
			path: '/user',
			responses: {
				200: z.array(userSansPasswordSchema),
			},
		},
		getOne: {
			method: 'GET',
			path: '/user/:id',
			pathParams: z.strictObject({ id: z.string() }),
			responses: {
				200: userSansPasswordSchema,
				404: z.null(),
			},
		},
		post: {
			method: 'POST',
			path: '/user',
			body: userSansMetaSchema
				.extend({
					passwordConfirmation: z.string(),
				})
				.refine((data) => data.password === data.passwordConfirmation, {
					message: 'Passwords do not match',
					path: ['passwordConfirmation'],
				}),
			responses: {
				201: userSansPasswordSchema,
			},
		},
	},
	{ strictStatusCodes: true },
);

export const userRouter = r.router(userContract, {
	get: async () => {
		const body = await findUsers();
		return { status: 200, body };
	},
	getOne: async ({ params }) => {
		const body = await findUserById(params.id);
		if (!body) return { status: 404, body: null };
		return { status: 200, body };
	},
	post: async (request) => {
		const body = await createUser(request.body);
		return { status: 201, body };
	},
});
