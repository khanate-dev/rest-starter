import { echoHandler } from '~/controllers/general';
import { echoSchema } from '~/schemas/general';
import type { Route } from '~/types';

const generalRoutes: Route[] = [
	{
		method: 'get',
		path: '/echo',
		schema: echoSchema,
		handler: echoHandler,
	},
];

export default generalRoutes;
