import pino from 'pino';

export const LOGGER = pino({
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
