import { ApiError } from '~/errors';
import { createUser, findUserById, findUsers } from '~/services/user';
import { STATUS } from '~/types';

import type {
	CreateUserSchema,
	GetUserSchema,
	GetUsersSchema,
} from '~/schemas/user';
import type { UnAuthenticatedHandler, AuthenticatedHandler } from '~/types';


export const createUserHandler: UnAuthenticatedHandler<
	CreateUserSchema
> = async (request) => {
	const user = await createUser(request.body);
	return {
		json: user,
		status: STATUS.created,
	};
};

export const getUsersHandler: AuthenticatedHandler<
	GetUsersSchema
> = async () => {
	const users = await findUsers();
	return users;
};

export const getUserHandler: AuthenticatedHandler<GetUserSchema> = async (
	request
) => {
	const user = await findUserById(request.params._id);
	if (!user)
		throw new ApiError(STATUS.notFound, 'the requested user was not found');
	return user;
};
