import { getErrorMessage, getErrorResponseAndCode } from '~/helpers/error';
import { STATUS } from '~/helpers/http';
import { logger } from '~/logger';

import { objectValues } from './helpers/object';
import { generalRoutes } from './routes/general';
import { sessionRoutes } from './routes/session';
import { userRoutes } from './routes/user';

import type { Express } from 'express';
import type { Route, Routes } from './helpers/route';

const routeMap: Record<string, Routes<any>> = {
	user: userRoutes,
	general: generalRoutes,
	session: sessionRoutes,
};

export const registerRoutes = (app: Express) => {
	const routes = Object.entries(routeMap)
		.map<Route[]>(([name, routeArray]) => {
			try {
				const prefix = name === 'general' ? '' : name;
				return objectValues(routeArray).map((route) => ({
					...route,
					path: `${prefix}${route.path}`.replace(/^\/|\/$/u, ''),
				})) as never;
			} catch (error) {
				logger.error(`Invalid ${name} routes: ${getErrorMessage(error)}`);
				return [];
			}
		})
		.flat();

	for (const route of routes) {
		const { method, path, middleware, handler } = route;
		const routePath = `/api/${path}`;
		const middlewares = middleware
			? Array.isArray(middleware)
				? middleware
				: [middleware]
			: [];
		app[method](routePath, ...middlewares, handler);

		logger.info(
			`Registered Route:\t${route.method.toUpperCase()}\t${routePath}`,
		);
	}

	app.use((_request, response) => {
		const { json } = getErrorResponseAndCode(new Error('Path not found'));
		response.status(STATUS.notFound).json(json);
	});
};
