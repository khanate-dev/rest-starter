import { Schema, model, Types } from 'mongoose';

import { ModelObject, WithMongoId } from '~/types/general';

export interface Session extends ModelObject {
	user: Types.ObjectId,
	valid: boolean,
	userAgent: string,
}

export type SessionWithId = WithMongoId<Session>;

const sessionSchema = new Schema<SessionWithId>(
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
