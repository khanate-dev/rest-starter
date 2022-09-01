import { Express, RequestHandler } from 'express';

import { getErrorResponseAndCode } from './helpers/error';
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

import { PrivateRoute, PublicRoute, Status } from './types';
import { isDetailedResponse } from './helpers/type';

const publicRoutes: PublicRoute[] = [
	{
		method: 'get',
		path: 'health-check',
		handler: async () => ({
			success: true,
			message: 'The api server is up',
		}),
	},
	{
		method: 'post',
		path: 'users',
		schema: createUserSchema,
		handler: createUserHandler,
	},
	{
		method: 'post',
		path: 'sessions',
		schema: createSessionSchema,
		handler: createSessionHandler,
	},
];

const privateRoutes: PrivateRoute[] = [
	{
		method: 'get',
		path: 'sessions',
		handler: getSessionsHandler,
	},
	{
		method: 'delete',
		path: 'sessions',
		handler: deleteSessionHandler,
	},
	{
		method: 'post',
		path: 'products',
		schema: createProductSchema,
		handler: createProductHandler,
	},
	{
		method: 'put',
		path: 'products/:_id',
		schema: updateProductSchema,
		handler: updateProductHandler,
	},
	{
		method: 'get',
		path: 'products/:_id',
		schema: getProductSchema,
		handler: getProductHandler,
	},
	{
		method: 'delete',
		path: 'products/:_id',
		schema: deleteProductSchema,
		handler: deleteProductHandler,
	},
];

const setupRoute = (
	app: Express,
	route: PublicRoute | PrivateRoute
) => {

	const { method, path, schema, middleware, handler } = route;

	const routePath = `/api/${path}`;

	const middlewareList = (
		middleware
			? Array.isArray(middleware)
				? middleware
				: [middleware]
			: []
	);

	const handlerWrapper: RequestHandler<any, any, any, any, any> = async (
		request,
		response,
		next
	) => {
		try {
			const handlerResponse = await handler(
				request,
				response,
				next
			);
			const isDetailed = isDetailedResponse(handlerResponse);
			const status = isDetailed ? handlerResponse.status : Status.OK;
			const json = isDetailed ? handlerResponse.json : handlerResponse;
			response.status(status).json(json);
		}
		catch (error: any) {
			logger.error(error);
			const { status, json } = getErrorResponseAndCode(error);
			response.status(status).json(json);
		}
	};

	app[method](
		routePath,
		validateRequest(schema),
		...middlewareList,
		handlerWrapper
	);

	logger.info(`Registered Route:\t${routePath}`);

};

const registerRoutes = (app: Express) => {

	for (const route of publicRoutes) setupRoute(app, route);

	app.use(validateAuth);

	for (const route of privateRoutes) setupRoute(app, route);

};

export default registerRoutes;