import { RequestHandler } from 'express';
import z from 'zod';

import { requestSchema } from '~/helpers/type';

const validateRequest = (
	schema: z.AnyZodObject = requestSchema({})
): RequestHandler => (
	(request, response, next) => {
		try {
			schema.parse({
				body: request.body,
				query: request.query,
				params: request.params,
			});
			return next();
		}
		catch (error: any) {
			return response.status(400).send(error.errors);
		}
	}
);

export default validateRequest;