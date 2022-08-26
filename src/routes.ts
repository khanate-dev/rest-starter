import { Express } from 'express';

import logger from '~/helpers/logger';

import { validateRequest, validateAuth } from '~/middlewares';

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

	app.post('/api/users', validateRequest(createUserSchema), createUserHandler);

	app.post('/api/sessions', validateRequest(createSessionSchema), createSessionHandler);

	app.use(validateAuth);

	app.get('/api/sessions', getSessionsHandler);

	app.delete('/api/sessions', deleteSessionHandler);

	app.post('/api/products', validateRequest(createProductSchema), createProductHandler);

	app.put('/api/products/:_id', validateRequest(updateProductSchema), updateProductHandler);

	app.get('/api/products/:_id', validateRequest(getProductSchema), getProductHandler);

	app.delete('/api/products/:_id', validateRequest(deleteProductSchema), deleteProductHandler);

};

export default routes;