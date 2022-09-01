import { FilterQuery, Types, UpdateQuery } from 'mongoose';

import { SessionModel, Session } from '~/models/session';

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
	query: FilterQuery<Session>
) => {
	return SessionModel.find(query).lean();
};

export const findSessionById = (
	id: string | Types.ObjectId
) => {
	return SessionModel.findById(id).lean();
};

export const updateSession = (
	query: FilterQuery<Session>,
	update: UpdateQuery<Session>
) => {
	return SessionModel.updateOne(query, update);
};