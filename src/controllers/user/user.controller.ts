import { CreateUserSchema } from '~/schemas/user';

import { createUser } from '~/services/user';

import { PublicHandler, Status } from '~/types';

export const createUserHandler: PublicHandler<CreateUserSchema> = async (
	request
) => {
	const user = await createUser(request.body);
	return {
		status: Status.CREATED,
		json: user,
	};
};