import z from 'zod';

import { requestSchema } from '~/helpers/type';

export const createUserSchema = requestSchema({
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
	}).refine(data => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation'],
	}),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;