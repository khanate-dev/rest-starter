import { Schema, model, Document } from 'mongoose';

import { getHashedPassword } from '~/helpers/crypto';

import { ModelObject, WithMongoId } from '~/types/general';

export interface User extends ModelObject {
	email: string,
	name: string,
	password: string,
}

export type UserWithId = WithMongoId<User>;

export type UserWithoutPassword = Omit<UserWithId, 'password'>;

const userSchema = new Schema<UserWithId>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', async function(next) {

	const user = this as unknown as Document<any, any, User>;
	if (!user.isModified('password')) {
		return next();
	}

	const password = user.get('password').normalize();
	const hashedPassword = getHashedPassword(password);
	user.set('password', hashedPassword);

	return next();

});

export const UserModel = model('User', userSchema);