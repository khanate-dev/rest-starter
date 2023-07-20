import { z } from 'zod';

import { ApiError } from '~/errors';
import { STATUS } from '~/helpers/http';
import { createContract, createRoutes } from '~/helpers/route';
import { userSansMetaSchema, userSansPasswordSchema } from '~/schemas/user';
import { createUser, findUserById, findUsers } from '~/services/user';

export const userContract = createContract({
	get: {
		method: 'get',
		path: '/',
		auth: true,
		availableTo: 'admin',
		response: z.array(userSansPasswordSchema),
	},
	getOne: {
		method: 'get',
		path: '/:id',
		auth: false,
		availableTo: 'admin',
		params: { id: 'string' },
		response: userSansPasswordSchema,
	},
	post: {
		method: 'post',
		path: '/',
		body: userSansMetaSchema
			.extend({
				passwordConfirmation: z.string(),
			})
			.refine((data) => data.password === data.passwordConfirmation, {
				message: 'Passwords do not match',
				path: ['passwordConfirmation'],
			}),
		response: userSansPasswordSchema,
	},
});

export const userRoutes = createRoutes(userContract, {
	get: async () => {
		const users = await findUsers();
		return users;
	},
	getOne: async ({ params }) => {
		const user = await findUserById(params.id);
		if (!user)
			throw new ApiError(STATUS.notFound, 'the requested user was not found');
		return user;
	},
	post: async (request) => {
		const user = await createUser(request.body);
		return { json: user, status: STATUS.created };
	},
});
