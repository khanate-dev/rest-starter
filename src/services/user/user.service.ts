
import { comparePassword } from '~/helpers/crypto';
import omitKey from '~/helpers/omit-key';
import { UserModel } from '~/models/user';

import type { UserSansMeta, UserSansPassword } from '~/models/user';
import type { DocumentDefinition, FilterQuery, QueryOptions, Types } from 'mongoose';

export const createUser = async (
	input: DocumentDefinition<UserSansMeta>
): Promise<UserSansPassword> => {
	const user = (await UserModel.create(input)).toJSON();
	return omitKey(user, 'password');
};

export const validatePassword = async (
	{ email, password }: Pick<UserSansMeta, 'email' | 'password'>
): Promise<UserSansPassword | false> => {

	const user = await UserModel.findOne({ email }).lean();
	if (!user) return false;

	if (!comparePassword(password, user.password)) return false;

	return omitKey(user, 'password');

};

export const findUsers = async (
	query?: FilterQuery<UserSansMeta>,
	options?: QueryOptions
): Promise<UserSansPassword[]> => {
	const users = await UserModel.find(
		query ?? {},
		{},
		options
	).lean();
	return users.map(user => omitKey(user, 'password'));
};

export const findUser = async (
	query: FilterQuery<UserSansMeta>,
	options?: QueryOptions
): Promise<UserSansPassword | null> => {
	const user = await UserModel.findOne(
		query,
		{},
		options
	).lean();
	if (!user) return null;
	return omitKey(user, 'password');
};

export const findUserById = async (
	id: Types.ObjectId | string
): Promise<UserSansPassword | null> => {
	const user = await UserModel.findById(id).lean();
	if (!user) return null;
	return omitKey(user, 'password');
};
