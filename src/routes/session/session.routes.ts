import {
	createSessionHandler,
	deleteSessionHandler,
	getSessionsHandler,
} from '~/helpers/controllers/session';
import {
	CREATE_SESSION_SCHEMA,
	DELETE_SESSION_SCHEMA,
	GET_SESSIONS_SCHEMA,
} from '~/schemas/session';

import type { Route } from '~/types';

export const sessionRoutes: Route[] = [
	{
		handler: createSessionHandler,
		method: 'post',
		path: '/',
		schema: CREATE_SESSION_SCHEMA,
	},
	{
		handler: getSessionsHandler,
		isAuthenticated: true,
		method: 'get',
		path: '/',
		schema: GET_SESSIONS_SCHEMA,
	},
	{
		handler: deleteSessionHandler,
		isAuthenticated: true,
		method: 'delete',
		path: '/',
		schema: DELETE_SESSION_SCHEMA,
	},
];
