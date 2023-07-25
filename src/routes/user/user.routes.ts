import { initContract } from '@ts-rest/core';
import { initServer } from '@ts-rest/express';
import { z } from 'zod';

import { validatedHandler } from '~/helpers/auth';
import { omit } from '~/helpers/object';
import { prisma } from '~/prisma-client';
import { userSansMetaSchema, userSansPasswordSchema } from '~/schemas/user';

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
	get: validatedHandler(async () => {
		const users = await prisma.user.findMany();
		const body = users.map((user) => omit(user, 'password'));
		return { status: 200, body };
	}),
	getOne: validatedHandler(async ({ params }) => {
		const user = await prisma.user.findUnique({
			where: { id: params.id },
		});
		if (!user) return { status: 404, body: null };
		const body = omit(user, 'password');
		return { status: 200, body };
	}),
	post: async ({ body }) => {
		const user = await prisma.user.create({ data: body });
		const res = omit(user, 'password');
		return { status: 201, body: res };
	},
});
