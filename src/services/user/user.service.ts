import { DocumentDefinition, FilterQuery } from 'mongoose';

import { comparePassword } from '~/helpers/crypto';
import omitKey from '~/helpers/omit-key';

import { UserModel, UserSansMeta, UserSansPassword } from '~/models/user';

export const createUser = async (
	input: DocumentDefinition<UserSansMeta>
): Promise<UserSansPassword> => {
	const user = await UserModel.create(input);
	return omitKey(user.toJSON(), 'password');
};

export const validatePassword = async (
	{ email, password }: Omit<UserSansMeta, 'name'>
): Promise<false | UserSansPassword> => {

	const user = await UserModel.findOne({ email }).lean();
	if (!user) return false;

	if (!comparePassword(password, user.password)) return false;

	return omitKey(user, 'password');

};

export const findUser = async (
	query: FilterQuery<UserSansMeta>
): Promise<null | UserSansPassword> => {
	const user = await UserModel.findOne(query).lean();
	if (!user) return null;
	return omitKey(user, 'password');
};