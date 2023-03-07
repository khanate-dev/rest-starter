import {
	createUserHandler,
	getUserHandler,
	getUsersHandler,
} from '~/controllers/user';
import {
	createUserSchema,
	getUserSchema,
	getUsersSchema,
} from '~/schemas/user';

import type { Route } from '~/types';

const userRoutes: Route[] = [
	{
		handler: createUserHandler,
		method: 'post',
		path: '/',
		schema: createUserSchema,
	},
	{
		availableTo: 'admin',
		handler: getUsersHandler,
		isAuthenticated: true,
		method: 'get',
		path: '/',
		schema: getUsersSchema,
	},
	{
		availableTo: 'admin',
		handler: getUserHandler,
		isAuthenticated: true,
		method: 'get',
		path: '/:_id',
		schema: getUserSchema,
	},
];

export default userRoutes;
