import pino from 'pino';

export const logger = pino({
	base: {
		pid: false,
	},
	transport: {
		options: {
			colorize: true,
		},
		target: 'pino-pretty',
	},
});
