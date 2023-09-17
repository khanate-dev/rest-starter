import { createExpressEndpoints } from '@ts-rest/express';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { config } from '~/config.js';
import { dayjsFormatPatterns, dayjsUtc } from '~/helpers/date.helpers.js';
import { logger, stylized } from '~/logger.js';
import { contract, router } from '~/routes/routes.js';

const app = express();

const CORS_OPTIONS: cors.CorsOptions = {
	allowedHeaders: ['x-refresh', 'Content-Type', 'Authorization'],
	exposedHeaders: ['x-access-token'],
};

// TODO Modify origin to correct production origin
if (config.env === 'production') CORS_OPTIONS.origin = 'example.com';

app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

createExpressEndpoints(contract, router, app, {
	logInitialization: true,
	requestValidationErrorHandler: 'combined',
	responseValidation: true,
	globalMiddleware: [
		(req, _res, next) => {
			console.info(
				dayjsUtc().format(dayjsFormatPatterns.datetime),
				'=>',
				stylized(req.method, 'green'),
				req.originalUrl,
			);
			next();
		},
	],
});

app.use((_request, response) =>
	response
		.status(404)
		.json({ name: 'NotFoundError', message: 'Resource Not Found!' }),
);

const SERVER = app.listen(config.port, () => {
	logger.info(`Server is running at http://localhost:${config.port}`);
});

SERVER.on('error', (error) => {
	logger.fatal(error);
});
