import { strictObject, string, TypeOf } from 'zod';

import { requestSchema } from '~/helpers/type';

export const createSessionSchema = requestSchema({
	body: strictObject({
		email: string({
			required_error: 'Email is required',
		}).email('Not a valid email'),
		password: string({
			required_error: 'Password is required',
		}),
	}),
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>;