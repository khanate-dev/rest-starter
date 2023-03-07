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
		handler: createSessionHandler,
		method: 'post',
		path: '/',
		schema: createSessionSchema,
	},
	{
		handler: getSessionsHandler,
		isAuthenticated: true,
		method: 'get',
		path: '/',
		schema: getSessionsSchema,
	},
	{
		handler: deleteSessionHandler,
		isAuthenticated: true,
		method: 'delete',
		path: '/',
		schema: deleteSessionSchema,
	},
];

export default sessionRoutes;
