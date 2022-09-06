import { Express, RequestHandler } from 'express';

import { getErrorResponseAndCode } from './helpers/error';
import logger from '~/helpers/logger';
import { isDetailedResponse } from './helpers/type';

import { validateRequest, validateAuth } from '~/middlewares';

import generalRoutes from '~/routes/general';
import userRoutes from '~/routes/user';
import productRoutes from '~/routes/product';
import sessionRoutes from '~/routes/session';

import {
	PrivateRoute,
	PublicRoute,
	Status,
	_PrivateHandler,
	_PublicHandler,
} from './types';

const asyncHandler = (
	handler: _PublicHandler | _PrivateHandler
): RequestHandler<any, any, any, any, any> => (
	async (
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
	}
);

const setupRoute = (
	app: Express,
	route: PublicRoute | PrivateRoute
) => {

	const { method,
		path,
		schema,
		middleware,
		handler,
		isPrivate,
	} = route;

	const routePath = `/api/${path}`;

	const middlewares = (
		middleware
			? Array.isArray(middleware)
				? middleware
				: [middleware]
			: []
	);
	if (isPrivate) {
		middlewares.unshift(validateAuth);
	}

	app[method](
		routePath,
		validateRequest(schema),
		...middlewares,
		asyncHandler(handler)
	);

	logger.info(`Registered Route:\t${route.method.toUpperCase()}\t${routePath}`);

};

const routes = [
	...generalRoutes,
	...userRoutes,
	...productRoutes,
	...sessionRoutes,
];

const registerRoutes = (app: Express) => {

	for (const route of routes) {
		setupRoute(app, route);
	}

	app.use((_request, response) => {
		const { json } = getErrorResponseAndCode(new Error('Path not found'));
		response.status(Status.NOT_FOUND).json(json);
	});

};

export default registerRoutes;