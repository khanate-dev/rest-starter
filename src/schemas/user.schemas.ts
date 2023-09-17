import { z } from 'zod';

import { createModelSchema } from '~/helpers/schema.helpers.js';

export const userRoles = ['user', 'admin', 'guest'] as const;

export type UserRole = (typeof userRoles)[number];

export const [userSansMetaSchema, userSchema] = createModelSchema({
	email: z.string().email(),
	name: z.string(),
	password: z.string(),
	role: z.enum(userRoles),
});

export type UserSansMeta = z.infer<typeof userSansMetaSchema>;

export type User = z.infer<typeof userSchema>;

export const userSansPasswordSchema = userSchema.omit({
	password: true,
});
export type UserSansPassword = z.infer<typeof userSansPasswordSchema>;
