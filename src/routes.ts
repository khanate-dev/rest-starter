import { Express, RequestHandler } from 'express';

import { getErrorResponseAndCode } from './helpers/error';
import logger from '~/helpers/logger';
import { isDetailedResponse } from './helpers/type';

import { validateRequest, validateAuth } from '~/middlewares';

import {
	echoSchema,
	createUserSchema,
	createSessionSchema,
	createProductSchema,
	deleteProductSchema,
	getProductSchema,
	updateProductSchema,
	getProductsSchema,
	getSessionsSchema,
	deleteSessionSchema,
} from '~/schemas';

import {
	echoHandler,
	createUserHandler,
	createSessionHandler,
	deleteSessionHandler,
	getSessionsHandler,
	createProductHandler,
	deleteProductHandler,
	getProductHandler,
	updateProductHandler,
	getProductsHandler,
} from '~/controllers';

import { PrivateRoute, PublicRoute, Status } from './types';

const publicRoutes: PublicRoute[] = [
	{
		method: 'get',
		path: 'echo',
		schema: echoSchema,
		handler: echoHandler,
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
		schema: getSessionsSchema,
		handler: getSessionsHandler,
	},
	{
		method: 'delete',
		path: 'sessions',
		schema: deleteSessionSchema,
		handler: deleteSessionHandler,
	},
	{
		method: 'post',
		path: 'products',
		schema: createProductSchema,
		handler: createProductHandler,
	},
	{
		method: 'get',
		path: 'products',
		schema: getProductsSchema,
		handler: getProductsHandler,
	},
	{
		method: 'get',
		path: 'products/:_id',
		schema: getProductSchema,
		handler: getProductHandler,
	},
	{
		method: 'put',
		path: 'products/:_id',
		schema: updateProductSchema,
		handler: updateProductHandler,
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

	app.use((_request, response) => {
		const { json } = getErrorResponseAndCode(new Error('Path not found'));
		response.status(Status.NOT_FOUND).json(json);
	});

};

export default registerRoutes;