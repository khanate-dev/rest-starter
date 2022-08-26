import { RequestHandler } from 'express';

import logger from '~/helpers/logger';

import { CreateUserInput } from '~/schemas/user';

import { createUser } from '~/services/user';

export const createUserHandler: RequestHandler<any, any, CreateUserInput['body']> = async (
	request,
	response
) => {
	try {
		const user = await createUser(request.body);
		return response.send(user);
	}
	catch (error: any) {
		logger.error(error);
		return response.status(409).send(error.message ?? error);
	}
};