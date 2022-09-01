import { Schema, model, Types } from 'mongoose';
import z from 'zod';

import { getModelSchema } from '~/helpers/schema';

export const {
	sansMetaModelSchema: sessionSansMetaModelSchema,
	modelSchema: sessionModelSchema,
} = getModelSchema({
	user: z.instanceof(Types.ObjectId),
	valid: z.boolean(),
	userAgent: z.string(),
});

export type SessionSansMeta = z.infer<typeof sessionSansMetaModelSchema>;

export type Session = z.infer<typeof sessionModelSchema>;

const sessionSchema = new Schema<Session>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		valid: {
			type: Boolean,
			default: true,
		},
		userAgent: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

export const SessionModel = model('Session', sessionSchema);
