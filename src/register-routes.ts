import fs from 'fs';

import { LOGGER } from '~/logger';
import { getErrorMessage, getErrorResponseAndCode } from '~/helpers/error';
import { assertRoutes, isDetailedResponse } from '~/helpers/type';
import { STATUS } from '~/helpers/http';
import { validateRequest, validateAuth } from '~/middlewares';

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
		asyncHandler(handler)
	);

	LOGGER.info(`Registered Route:\t${route.method.toUpperCase()}\t${routePath}`);
};

export const registerRoutes = async (app: Express) => {
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
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
					const importedRoutes = (await import(`~/routes/${name}`)).ROUTES;
					assertRoutes(importedRoutes);
					const prefix = name === 'general' ? '' : name;
					return importedRoutes.map((route) => ({
						...route,
						path: `${prefix}${route.path}`.replace(/^\/|\/$/u, ''),
					}));
				} catch (error) {
					LOGGER.error(`Invalid ${name} routes: ${getErrorMessage(error)}`);
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
