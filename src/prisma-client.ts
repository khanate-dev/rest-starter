import { PrismaClient } from '@prisma/client';

import { config } from '~/config';
import { logger } from '~/logger';

export const prisma = new PrismaClient({
	errorFormat: config.env === 'development' ? 'pretty' : undefined,
	log: [
		{ emit: 'event', level: 'query' },
		{ emit: 'event', level: 'error' },
		{ emit: 'event', level: 'info' },
		{ emit: 'event', level: 'warn' },
	],
});

prisma.$on('query', logger.info);
prisma.$on('info', logger.info);
prisma.$on('error', logger.warn);
prisma.$on('warn', logger.error);
