import { echoHandler } from '~/controllers/general';
import { echoSchema } from '~/schemas/general';

import type { Route } from '~/types';

const generalRoutes: Route[] = [
	{
		handler: echoHandler,
		method: 'get',
		path: '/echo',
		schema: echoSchema,
	},
];

export default generalRoutes;
