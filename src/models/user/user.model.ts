import { Schema, model } from 'mongoose';
import z from 'zod';

import { getHashedPassword } from '~/helpers/crypto';
import { getModelSchema } from '~/helpers/schema';

import type { Document } from 'mongoose';

export const userRoles = [
	'user',
	'admin',
	'guest',
] as const;

export type UserRole = typeof userRoles[number];

export const [
	userSansMetaModelSchema,
	userModelSchema,
] = getModelSchema({
	email: z.string().email(),
	name: z.string(),
	password: z.string(),
	role: z.enum(userRoles),
});

export type UserSansMeta = z.infer<typeof userSansMetaModelSchema>;

export type User = z.infer<typeof userModelSchema>;

export const userSansPasswordModelSchema = userModelSchema.omit({
	password: true,
});
export type UserSansPassword = z.infer<typeof userSansPasswordModelSchema>;

const userSchema = new Schema<User>(
	{
		email: {
			required: true,
			type: String,
			unique: true,
		},
		name: {
			required: true,
			type: String,
		},
		password: {
			required: true,
			type: String,
		},
		role: {
			enum: userRoles,
			required: true,
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', async function (next) {

	const user = this as unknown as Document<any, any, UserSansMeta>;
	if (!user.isModified('password')) 
		{ next(); return; }
	

	const password = user.get('password').normalize();
	const hashedPassword = getHashedPassword(password);
	user.set('password', hashedPassword);

	next();

});

export const UserModel = model('User', userSchema);
