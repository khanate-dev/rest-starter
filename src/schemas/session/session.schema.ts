import z from 'zod';

import { requestSchema } from '~/helpers/type';

export const createSessionSchema = requestSchema({
	body: z.strictObject({
		email: z.string({
			required_error: 'Email is required',
		}).email('Not a valid email'),
		password: z.string({
			required_error: 'Password is required',
		}),
	}),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;