import {
	createSessionHandler,
	getSessionsHandler,
	deleteSessionHandler,
} from '~/controllers/session';
import {
	createSessionSchema,
	getSessionsSchema,
	deleteSessionSchema,
} from '~/schemas/session';
import type { Route } from '~/types';

const sessionRoutes: Route[] = [
	{
		method: 'post',
		path: '/',
		schema: createSessionSchema,
		handler: createSessionHandler,
	},
	{
		method: 'get',
		path: '/',
		schema: getSessionsSchema,
		handler: getSessionsHandler,
		isAuthenticated: true,
	},
	{
		method: 'delete',
		path: '/',
		schema: deleteSessionSchema,
		handler: deleteSessionHandler,
		isAuthenticated: true,
	},
];

export default sessionRoutes;
