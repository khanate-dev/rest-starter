import { PrismaClient } from '@prisma/client';

import { CONFIG } from '~/config';
import { LOGGER } from '~/logger';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const prisma = new PrismaClient({
	errorFormat: CONFIG.env === 'development' ? 'pretty' : undefined,
	log: [
		{
			emit: 'event',
			level: 'query',
		},
		{
			emit: 'event',
			level: 'error',
		},
		{
			emit: 'event',
			level: 'info',
		},
		{
			emit: 'event',
			level: 'warn',
		},
	],
});

prisma.$on('query', LOGGER.info);
prisma.$on('info', LOGGER.info);
prisma.$on('error', LOGGER.warn);
prisma.$on('warn', LOGGER.error);
