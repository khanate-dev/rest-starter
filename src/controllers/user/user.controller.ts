import { CreateUserSchema } from '~/schemas/user';

import { createUser } from '~/services/user';

import { UnAuthenticatedHandler, Status } from '~/types';

export const createUserHandler: UnAuthenticatedHandler<CreateUserSchema> = async (
	request
) => {
	const user = await createUser(request.body);
	return {
		status: Status.CREATED,
		json: user,
	};
};