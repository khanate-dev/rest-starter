import { UserSansPassword } from '~/models';

import { CreateUserInput } from '~/schemas/user';

import { createUser } from '~/services/user';

import { PublicHandler, Status } from '~/types';

export const createUserHandler: PublicHandler<
	CreateUserInput,
	UserSansPassword
> = async (request) => {
	const user = await createUser(request.body);
	return {
		status: Status.CREATED,
		json: user,
	};
};