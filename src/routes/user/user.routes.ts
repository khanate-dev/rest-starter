import {
	createUserHandler,
	getUserHandler,
	getUsersHandler,
} from '~/controllers/user';
import {
	CREATE_USER_SCHEMA,
	GET_USERS_SCHEMA,
	GET_USER_SCHEMA,
} from '~/schemas/user';

import type { Route } from '~/types';

export const ROUTES: Route[] = [
	{
		handler: createUserHandler,
		method: 'post',
		path: '/',
		schema: CREATE_USER_SCHEMA,
	},
	{
		availableTo: 'admin',
		handler: getUsersHandler,
		isAuthenticated: true,
		method: 'get',
		path: '/',
		schema: GET_USERS_SCHEMA,
	},
	{
		availableTo: 'admin',
		handler: getUserHandler,
		isAuthenticated: true,
		method: 'get',
		path: '/:_id',
		schema: GET_USER_SCHEMA,
	},
];
