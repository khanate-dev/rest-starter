import { DocumentDefinition, FilterQuery } from 'mongoose';

import { comparePassword } from '~/helpers/crypto';
import omitKey from '~/helpers/omit-key';

import { UserModel, User } from '~/models/user';

export const createUser = async (
	input: DocumentDefinition<Omit<User, 'createdAt' | 'updatedAt'>>
) => {
	const user = await UserModel.create(input);
	return omitKey(user.toJSON(), 'password');
};

export const validatePassword = async (
	{ email, password }: { email: string, password: string, }
) => {
	const user = await UserModel.findOne({ email });
	if (!user) return false;

	if (!comparePassword(password, user.password)) return false;

	return omitKey(user.toJSON(), 'password');
};

export const findUser = (
	query: FilterQuery<User>
) => {
	return UserModel.findOne(query).lean();
};