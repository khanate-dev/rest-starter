import { getErrorResponse } from '~/helpers/error';
import { createRouteSchema } from '~/helpers/schema';
import { STATUS } from '~/types';

import type { z } from 'zod';
import type { Middleware } from '~/types';

export const validateRequest =
	(schema: z.AnyZodObject = createRouteSchema({})): Middleware =>
	(request, response, next) => {
		try {
			schema.omit({ response: true }).parse({
				body: request.body,
				params: request.params,
				query: request.query,
			});
			next();
			return;
		} catch (error: any) {
			const json = getErrorResponse(error);
			return response.status(STATUS.notFound).send(json);
		}
	};
