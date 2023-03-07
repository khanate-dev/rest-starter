import { SessionModel } from '~/models/session';

import type {
	FilterQuery,
	QueryOptions,
	Types,
	UpdateQuery,
} from 'mongoose';
import type { Session } from '~/models/session';

export const createSession = async (
	userId: Types.ObjectId,
	userAgent: string
): Promise<Session> => {
	const session = (await SessionModel.create({
		user: userId,
		userAgent,
	})).toJSON();
	return session;
};

export const findSessions = async (
	query: FilterQuery<Session>,
	options?: QueryOptions
): Promise<Session[]> => {
	const sessions = await SessionModel.find(
		query,
		{},
		options
	).lean();
	return sessions;
};

export const findSessionById = async (
	id: Types.ObjectId | string
): Promise<Session | null> => {
	const session = await SessionModel.findById(id).lean();
	return session;
};

export const updateSession = async (
	query: FilterQuery<Session>,
	update: UpdateQuery<Session>
): Promise<Session | null> => {
	const updatedSession = await SessionModel.findOneAndUpdate(query, update).lean();
	return updatedSession;
};
