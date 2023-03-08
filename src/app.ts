import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { CONFIG } from '~/config';
import { LOGGER } from '~/logger';
import { registerRoutes } from '~/register-routes';

const app = express();

const CORS_OPTIONS: cors.CorsOptions = {
	allowedHeaders: ['x-refresh', 'Content-Type', 'Authorization'],
	exposedHeaders: ['x-access-token'],
};

// TODO Modify origin to correct production origin
if (CONFIG.env === 'production') CORS_OPTIONS.origin = 'example.com';

app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(pinoHttp({ logger: LOGGER }));

const SERVER = app.listen(CONFIG.port, () => {
	LOGGER.info(`App is running at http://localhost:${CONFIG.port}`);
	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	registerRoutes(app);
});

SERVER.on('error', (error) => {
	LOGGER.fatal(error);
});
