import { Express } from 'express';

import logger from '~/helpers/logger';

import { validateResource, validateAuth } from '~/middlewares';

import {
	createUserSchema,
	createSessionSchema,
	createProductSchema,
	deleteProductSchema,
	getProductSchema,
	updateProductSchema,
} from '~/schemas';

import {
	createUserHandler,
	createSessionHandler,
	deleteSessionHandler,
	getSessionsHandler,
	createProductHandler,
	deleteProductHandler,
	getProductHandler,
	updateProductHandler,
} from '~/controllers';

const routes = (app: Express) => {

	app.get('/health-check', (_request, response) => {
		logger.info('Reached');
		return response.sendStatus(200);
	});

	app.post('/api/users', validateResource(createUserSchema), createUserHandler);

	app.post('/api/sessions', validateResource(createSessionSchema), createSessionHandler);

	app.use(validateAuth);

	app.get('/api/sessions', getSessionsHandler);

	app.delete('/api/sessions', deleteSessionHandler);

	app.post('/api/products', validateResource(createProductSchema), createProductHandler);

	app.put('/api/products/:_id', validateResource(updateProductSchema), updateProductHandler);

	app.get('/api/products/:_id', validateResource(getProductSchema), getProductHandler);

	app.delete('/api/products/:_id', validateResource(deleteProductSchema), deleteProductHandler);

};

export default routes;