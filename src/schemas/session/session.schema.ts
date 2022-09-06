import z from 'zod';

import { createRouteSchema } from '~/helpers/schema';

import { sessionModelSchema } from '~/models';

export const createSessionSchema = createRouteSchema({
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

export type CreateSessionSchema = z.infer<typeof createSessionSchema>;

export const getSessionsSchema = createRouteSchema({
	response: z.array(sessionModelSchema),
});

export type GetSessionsSchema = z.infer<typeof getSessionsSchema>;

export const deleteSessionSchema = createRouteSchema({
	response: z.strictObject({
		accessToken: z.null(),
		refreshToken: z.null(),
	}),
});

export type DeleteSessionSchema = z.infer<typeof deleteSessionSchema>;