import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { config } from '~/config';
import { logger } from '~/logger';

import { registerRoutes } from './register-routes';

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
app.use(pinoHttp({ logger }));

const SERVER = app.listen(config.port, () => {
	logger.info(`App is running at http://localhost:${config.port}`);
	registerRoutes(app);
});

SERVER.on('error', (error) => {
	logger.fatal(error);
});
