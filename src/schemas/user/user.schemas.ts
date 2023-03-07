import { z } from 'zod';

import {
	createRouteSchema,
	createModelSchema,
	MONGO_ID_SCHEMA,
} from '~/helpers/schema';

export const USER_ROLES = ['user', 'admin', 'guest'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const [USER_SANS_META_SCHEMA, USER_SCHEMA] = createModelSchema({
	email: z.string().email(),
	name: z.string(),
	password: z.string(),
	role: z.enum(USER_ROLES),
});

export type UserSansMeta = z.infer<typeof USER_SANS_META_SCHEMA>;

export type User = z.infer<typeof USER_SCHEMA>;

export const USER_SANS_PASSWORD_SCHEMA = USER_SCHEMA.omit({
	password: true,
});
export type UserSansPassword = z.infer<typeof USER_SANS_PASSWORD_SCHEMA>;

export const CREATE_USER_SCHEMA = createRouteSchema({
	body: USER_SANS_META_SCHEMA.extend({
		passwordConfirmation: z.string(),
	}).refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation'],
	}),
	response: USER_SANS_PASSWORD_SCHEMA,
});

export type CreateUserSchema = z.infer<typeof CREATE_USER_SCHEMA>;

export const GET_USERS_SCHEMA = createRouteSchema({
	response: z.array(USER_SANS_PASSWORD_SCHEMA),
});

export type GetUsersSchema = z.infer<typeof GET_USERS_SCHEMA>;

export const GET_USER_SCHEMA = createRouteSchema({
	params: z.strictObject({
		_id: MONGO_ID_SCHEMA,
	}),
	response: USER_SANS_PASSWORD_SCHEMA,
});

export type GetUserSchema = z.infer<typeof GET_USER_SCHEMA>;
