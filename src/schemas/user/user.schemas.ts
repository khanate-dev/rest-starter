import z from 'zod';

import { createRouteSchema } from '~/helpers/schema';

import { userSansPasswordModelSchema, userTypes } from '~/models';

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
		userType: z.enum(userTypes, {
			required_error: 'userType is required',
		}),
	}).refine(data => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation'],
	}),
	response: userSansPasswordModelSchema,
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;