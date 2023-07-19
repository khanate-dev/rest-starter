import { getErrorMessage, getErrorResponseAndCode } from '~/helpers/error';
import { STATUS } from '~/helpers/http';
import { isDetailedResponse } from '~/helpers/type';
import { LOGGER } from '~/logger';
import { validateAuth, validateRequest } from '~/middlewares';

import { generalRoutes } from './routes/general';
import { sessionRoutes } from './routes/session';
import { userRoutes } from './routes/user';

import type { Express, RequestHandler } from 'express';
import type {
	Route,
	_AuthenticatedHandler,
	_UnAuthenticatedHandler,
} from './types';

const asyncHandler =
	(
		handler: _AuthenticatedHandler | _UnAuthenticatedHandler,
	): RequestHandler<any, any, any, any, any> =>
	async (request, response, next) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const handlerResponse = await handler(request, response, next);
			const isDetailed = isDetailedResponse(handlerResponse);
			const status = isDetailed ? handlerResponse.status : STATUS.ok;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const json = isDetailed ? handlerResponse.json : handlerResponse;
			response.status(status).json(json);
		} catch (error: any) {
			LOGGER.error(error);
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
		asyncHandler(handler),
	);

	LOGGER.info(`Registered Route:\t${route.method.toUpperCase()}\t${routePath}`);
};

export const registerRoutes = (app: Express) => {
	const routeMap = {
		user: userRoutes,
		general: generalRoutes,
		session: sessionRoutes,
	};

	const routes = Object.entries(routeMap)
		.map<Route[]>(([name, routeArray]) => {
			try {
				const prefix = name === 'general' ? '' : name;
				return routeArray.map((route) => ({
					...route,
					path: `${prefix}${route.path}`.replace(/^\/|\/$/u, ''),
				}));
			} catch (error) {
				LOGGER.error(`Invalid ${name} routes: ${getErrorMessage(error)}`);
				return [];
			}
		})
		.flat();

	for (const route of routes) setupRoute(app, route);

	app.use((_request, response) => {
		const { json } = getErrorResponseAndCode(new Error('Path not found'));
		response.status(STATUS.notFound).json(json);
	});
};
