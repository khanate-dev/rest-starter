import { echoSchema } from '~/schemas/general';

import { echoHandler } from '~/controllers/general';

import { Route } from '~/types';

const generalRoutes: Route[] = [
	{
		method: 'get',
		path: 'echo',
		schema: echoSchema,
		handler: echoHandler,
	},
];

export default generalRoutes;