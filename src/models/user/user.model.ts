import { Schema, model, Document } from 'mongoose';
import z from 'zod';

import { getHashedPassword } from '~/helpers/crypto';

import { getModelSchema } from '~/helpers/schema';

export const {
	sansMetaModelSchema: userSansMetaModelSchema,
	modelSchema: userModelSchema,
} = getModelSchema({
	email: z.string().email(),
	name: z.string(),
	password: z.string(),
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

	const user = this as unknown as Document<any, any, UserSansMeta>;
	if (!user.isModified('password')) {
		return next();
	}

	const password = user.get('password').normalize();
	const hashedPassword = getHashedPassword(password);
	user.set('password', hashedPassword);

	return next();

});

export const UserModel = model('User', userSchema);