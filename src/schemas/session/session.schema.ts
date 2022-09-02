import z from 'zod';

import { requestSchema } from '~/helpers/type';
import { sessionModelSchema } from '~/models';

export const createSessionSchema = requestSchema({
	body: z.strictObject({
		email: z.string({
			required_error: 'Email is required',
		}).email('Not a valid email'),
		password: z.string({
			required_error: 'Password is required',
		}),
	}),
	response: z.strictObject({
		accessToken: z.string(),
		refreshToken: z.string(),
	}),
});

export const getSessionsSchema = requestSchema({
	response: z.array(sessionModelSchema),
});

export const deleteSessionSchema = requestSchema({
	response: z.strictObject({
		accessToken: z.null(),
		refreshToken: z.null(),
	}),
});

export type CreateSessionSchema = z.infer<typeof createSessionSchema>;
export type GetSessionsSchema = z.infer<typeof getSessionsSchema>;
export type DeleteSessionSchema = z.infer<typeof deleteSessionSchema>;