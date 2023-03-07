import fs from 'fs';

import logger from '~/helpers/logger';
import { validateRequest, validateAuth } from '~/middlewares';

import { getErrorResponseAndCode } from './helpers/error';
import { assertRoutes, isDetailedResponse } from './helpers/type';
import { STATUS } from './types';

import type {
	Route,
	_AuthenticatedHandler,
	_UnAuthenticatedHandler,
} from './types';
import type { Express, RequestHandler } from 'express';

const asyncHandler =
	(
		handler: _AuthenticatedHandler | _UnAuthenticatedHandler
	): RequestHandler<any, any, any, any, any> =>
	async (request, response, next) => {
		try {
			const handlerResponse = await handler(request, response, next);
			const isDetailed = isDetailedResponse(handlerResponse);
			const status = isDetailed ? handlerResponse.status : STATUS.ok;
			const json = isDetailed ? handlerResponse.json : handlerResponse;
			response.status(status).json(json);
		} catch (error: any) {
			logger.error(error);
			const { status, json } = getErrorResponseAndCode(error);
			response.status(status).json(json);
		}
	};

const setupRoute = (app: Express, route: Route) => {
	const { method, path, schema, middleware, handler, isAuthenticated } = route;

	const routePath = `/api/${path}`;

	const middlewares = middleware
		? Array.isArray(middleware)
			? middleware
			: [middleware]
		: [];

	if (isAuthenticated) middlewares.unshift(validateAuth(route));

	app[method](
		routePath,
		validateRequest(schema),
		...middlewares,
		asyncHandler(handler)
	);

	logger.info(`Registered Route:\t${route.method.toUpperCase()}\t${routePath}`);
};

const registerRoutes = async (app: Express) => {
	const files = fs.readdirSync('./src/routes', {
		encoding: 'utf-8',
		withFileTypes: true,
	});
	const folders = files
		.filter((file) => file.isDirectory())
		.map((file) => file.name);

	const routes: Route[] = (
		await Promise.all(
			folders.map(async (name) => {
				try {
					const routes = (await import(`~/routes/${name}`))?.default;
					assertRoutes(routes);
					const prefix = name === 'general' ? '' : name;
					return routes.map((route) => ({
						...route,
						path: `${prefix}${route.path}`.replace(/^\/|\/$/, ''),
					}));
				} catch (error: any) {
					logger.error(`Invalid ${name} routes: ${error.message}`);
					return [];
				}
			})
		)
	).flat();

	for (const route of routes) setupRoute(app, route);

	app.use((_request, response) => {
		const { json } = getErrorResponseAndCode(new Error('Path not found'));
		response.status(STATUS.notFound).json(json);
	});
};

export default registerRoutes;
