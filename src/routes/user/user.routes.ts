import { createUserSchema } from '~/schemas/user';

import { createUserHandler } from '~/controllers/user';

import { Route } from '~/types';

const userRoutes: Route[] = [
	{
		method: 'post',
		path: 'users',
		schema: createUserSchema,
		handler: createUserHandler,
	},
];

export default userRoutes;