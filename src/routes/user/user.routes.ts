import {
	createUserSchema,
	getUserSchema,
	getUsersSchema,
} from '~/schemas/user';

import {
	createUserHandler,
	getUserHandler,
	getUsersHandler,
} from '~/controllers/user';

import { Route } from '~/types';

const userRoutes: Route[] = [
	{
		method: 'post',
		path: '/',
		schema: createUserSchema,
		handler: createUserHandler,
	},
	{
		method: 'get',
		path: '/',
		schema: getUsersSchema,
		handler: getUsersHandler,
		isAuthenticated: true,
		availableTo: 'admin',
	},
	{
		method: 'get',
		path: '/:_id',
		schema: getUserSchema,
		handler: getUserHandler,
		isAuthenticated: true,
		availableTo: 'admin',
	},
];

export default userRoutes;