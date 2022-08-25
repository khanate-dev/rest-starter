import { FilterQuery, Types, UpdateQuery } from 'mongoose';

import { SessionModel, SessionWithId } from '~/models/session';

export const createSession = async (
	userId: Types.ObjectId,
	userAgent: string
) => {
	const session = await SessionModel.create({
		user: userId,
		userAgent,
	});
	return session.toJSON();
};

export const findSessions = (
	query: FilterQuery<SessionWithId>
) => {
	return SessionModel.find(query).lean();
};

export const updateSession = (
	query: FilterQuery<SessionWithId>,
	update: UpdateQuery<SessionWithId>
) => {
	return SessionModel.updateOne(query, update);
};