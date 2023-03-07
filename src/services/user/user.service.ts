import { comparePassword } from '~/helpers/crypto';
import { omitKey } from '~/helpers/omit-key';
import { prisma } from '~/prisma-client';

import type { UserSansMeta, UserSansPassword } from '~/schemas/user';

export const createUser = async (
	data: UserSansMeta
): Promise<UserSansPassword> => {
	const user = await prisma.user.create({ data });
	return omitKey(user, 'password');
};

export const validatePassword = async ({
	email,
	password,
}: Pick<UserSansMeta, 'email' | 'password'>): Promise<
	UserSansPassword | false
> => {
	const user = await prisma.user.findFirst({
		where: { email },
	});
	if (!user) return false;

	if (!comparePassword(password, user.password)) return false;

	return omitKey(user, 'password');
};

export const findUsers = async (
	where?: UserSansMeta
): Promise<UserSansPassword[]> => {
	const users = await prisma.user.findMany({ where });
	return users.map((user) => omitKey(user, 'password'));
};

export const findUser = async (
	where: UserSansMeta
): Promise<UserSansPassword | null> => {
	const user = await prisma.user.findFirst({ where });
	if (!user) return null;
	return omitKey(user, 'password');
};

export const findUserById = async (
	id: string
): Promise<UserSansPassword | null> => {
	const user = await prisma.user.findUnique({
		where: { id },
	});
	if (!user) return null;
	return omitKey(user, 'password');
};
