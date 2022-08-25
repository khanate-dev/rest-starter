import pino from 'pino';

const logger = pino({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
	base: {
		pid: false,
	},
});

export default logger;