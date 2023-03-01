import { isValidObjectId } from 'mongoose';
import z from 'zod';

import { createRouteSchema } from '~/helpers/schema';
import { userSansPasswordModelSchema, userSansMetaModelSchema } from '~/models';

export const createUserSchema = createRouteSchema({
	body: (
		userSansMetaModelSchema.extend({
			passwordConfirmation: z.string({
				required_error: 'passwordConfirmation is required',
			}),
		}).refine(data => data.password === data.passwordConfirmation, {
			message: 'Passwords do not match',
			path: ['passwordConfirmation'],
		})
	),
	response: userSansPasswordModelSchema,
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const getUsersSchema = createRouteSchema({
	response: z.array(userSansPasswordModelSchema),
});

export type GetUsersSchema = z.infer<typeof getUsersSchema>;

export const getUserSchema = createRouteSchema({
	params: z.strictObject({
		_id: z.string().refine(
			isValidObjectId,
			'parameter must be a valid mongo ObjectID'
		),
	}),
	response: userSansPasswordModelSchema,
});

export type GetUserSchema = z.infer<typeof getUserSchema>;
