import {
	createSessionSchema,
	getSessionsSchema,
	deleteSessionSchema,
} from '~/schemas/session';

import {
	createSessionHandler,
	getSessionsHandler,
	deleteSessionHandler,
} from '~/controllers/session';

import { Route } from '~/types';

const sessionRoutes: Route[] = [
	{
		method: 'post',
		path: 'sessions',
		schema: createSessionSchema,
		handler: createSessionHandler,
	},
	{
		method: 'get',
		path: 'sessions',
		schema: getSessionsSchema,
		handler: getSessionsHandler,
		isPrivate: true,
	},
	{
		method: 'delete',
		path: 'sessions',
		schema: deleteSessionSchema,
		handler: deleteSessionHandler,
		isPrivate: true,
	},
];

export default sessionRoutes;