import pino from 'pino';

const logger = pino({
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

export default logger;
