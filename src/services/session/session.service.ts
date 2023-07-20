import { prisma } from '~/prisma-client';

import type { Session, SessionSansMeta } from '~/schemas/session';

export const createSession = async (
	userId: string,
	userAgent?: string,
): Promise<Session> => {
	return prisma.session.create({
		data: { userAgent, userId },
	});
};

export const findSessions = async (
	where: Partial<SessionSansMeta>,
): Promise<Session[]> => {
	return prisma.session.findMany({ where });
};

export const findSessionById = async (id: string): Promise<Session | null> => {
	return prisma.session.findUnique({ where: { id } });
};

export const updateSession = async (
	id: string,
	data: Partial<SessionSansMeta>,
): Promise<Session | null> => {
	return prisma.session.update({ data, where: { id } });
};
