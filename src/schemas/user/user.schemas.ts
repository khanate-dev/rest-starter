import { isValidObjectId } from 'mongoose';
import z from 'zod';

import { createRouteSchema } from '~/helpers/schema';

import { userSansPasswordModelSchema, userRoles } from '~/models';

export const createUserSchema = createRouteSchema({
	body: z.strictObject({
		name: z.string({
			required_error: 'Name is required',
		}),
		password: z.string({
			required_error: 'Password is required',
		}).min(6, 'Password too short - should be at least 6 characters'),
		passwordConfirmation: z.string({
			required_error: 'passwordConfirmation is required',
		}),
		email: z.string({
			required_error: 'Email is required',
		}).email('Not a valid email'),
		role: z.enum(userRoles, {
			required_error: 'role is required',
		}),
	}).refine(data => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation'],
	}),
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