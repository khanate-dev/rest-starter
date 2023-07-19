import { echoHandler } from '~/helpers/controllers/general';
import { ECHO_SCHEMA } from '~/schemas/general';

import type { Route } from '~/types';

export const generalRoutes: Route[] = [
	{
		handler: echoHandler,
		method: 'get',
		path: '/echo',
		schema: ECHO_SCHEMA,
	},
];
