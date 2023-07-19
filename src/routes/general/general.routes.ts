import { echoHandler } from '~/helpers/controllers/general';
import { ECHO_SCHEMA } from '~/schemas/general';

import type { Route } from '~/types';

export const ROUTES: Route[] = [
	{
		handler: echoHandler,
		method: 'get',
		path: '/echo',
		schema: ECHO_SCHEMA,
	},
];
