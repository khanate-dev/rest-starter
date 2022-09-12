import { ApiError } from '~/errors';
import {
	CreateUserSchema,
	GetUserSchema,
	GetUsersSchema,
} from '~/schemas/user';

import { createUser, findUserById, findUsers } from '~/services/user';

import {
	UnAuthenticatedHandler,
	Status,
	AuthenticatedHandler,
} from '~/types';

export const createUserHandler: UnAuthenticatedHandler<CreateUserSchema> = async (
	request
) => {
	const user = await createUser(request.body);
	return {
		status: Status.CREATED,
		json: user,
	};
};

export const getUsersHandler: AuthenticatedHandler<GetUsersSchema> = async () => {
	const users = await findUsers();
	return users;
};

export const getUserHandler: AuthenticatedHandler<GetUserSchema> = async (
	request
) => {
	const user = await findUserById(request.params._id);
	if (!user) throw new ApiError(Status.NOT_FOUND, 'the requested user was not found');
	return user;
};