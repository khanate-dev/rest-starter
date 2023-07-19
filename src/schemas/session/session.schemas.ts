import { z } from 'zod';

import {
	MONGO_ID_SCHEMA,
	createModelSchema,
	createRouteSchema,
} from '~/helpers/schema';

export const [SESSION_SANS_META_SCHEMA, SESSION_SCHEMA] = createModelSchema({
	userAgent: z.string(),
	userId: MONGO_ID_SCHEMA,
	valid: z.boolean().nullable(),
});

export type SessionSansMeta = z.infer<typeof SESSION_SANS_META_SCHEMA>;

export type Session = z.infer<typeof SESSION_SCHEMA>;

export const CREATE_SESSION_SCHEMA = createRouteSchema({
	body: z.strictObject({
		email: z.string().email(),
		password: z.string(),
	}),
	response: z.strictObject({
		accessToken: z.string(),
		refreshToken: z.string(),
	}),
});

export type CreateSessionSchema = z.infer<typeof CREATE_SESSION_SCHEMA>;

export const GET_SESSIONS_SCHEMA = createRouteSchema({
	response: z.array(SESSION_SCHEMA),
});

export type GetSessionsSchema = z.infer<typeof GET_SESSIONS_SCHEMA>;

export const DELETE_SESSION_SCHEMA = createRouteSchema({
	response: z.strictObject({
		accessToken: z.null(),
		refreshToken: z.null(),
	}),
});

export type DeleteSessionSchema = z.infer<typeof DELETE_SESSION_SCHEMA>;
