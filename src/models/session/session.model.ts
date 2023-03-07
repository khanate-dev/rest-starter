import { Schema, model, Types } from 'mongoose';
import z from 'zod';

import { getModelSchema } from '~/helpers/schema';

export const [
	sessionSansMetaModelSchema,
	sessionModelSchema,
] = getModelSchema({
	user: z.instanceof(Types.ObjectId),
	userAgent: z.string(),
	valid: z.boolean(),
});

export type SessionSansMeta = z.infer<typeof sessionSansMetaModelSchema>;

export type Session = z.infer<typeof sessionModelSchema>;

const sessionSchema = new Schema<Session>(
	{
		user: {
			ref: 'User',
			type: Schema.Types.ObjectId,
		},
		userAgent: {
			type: String,
		},
		valid: {
			default: true,
			type: Boolean,
		},
	},
	{
		timestamps: true,
	}
);

export const SessionModel = model('Session', sessionSchema);
