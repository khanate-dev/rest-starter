import { PrismaClient } from '@prisma/client';

import { config } from '~/config.js';

export const prisma = new PrismaClient({
	errorFormat: config.env === 'development' ? 'pretty' : undefined,
	log: [
		{ emit: 'event', level: 'query' },
		{ emit: 'event', level: 'error' },
		{ emit: 'event', level: 'info' },
		{ emit: 'event', level: 'warn' },
	],
});

// TODO figure out the issue with the logging
// prisma.$on('query', logger.info);
// prisma.$on('info', logger.info);
// prisma.$on('error', logger.warn);
// prisma.$on('warn', logger.error);
