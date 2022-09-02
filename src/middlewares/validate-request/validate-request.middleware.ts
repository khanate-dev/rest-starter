import { RequestHandler } from 'express';
import z from 'zod';

import { getErrorResponse } from '~/helpers/error';

import { requestSchema } from '~/helpers/type';

import { Status } from '~/types';

const validateRequest = (
	schema: z.AnyZodObject = requestSchema({})
): RequestHandler => (
	(request, response, next) => {
		try {
			schema.omit({ response: true }).parse({
				body: request.body,
				query: request.query,
				params: request.params,
			});
			return next();
		}
		catch (error: any) {
			const json = getErrorResponse(error);
			return response.status(Status.NOT_FOUND).send(json);
		}
	}
);

export default validateRequest;