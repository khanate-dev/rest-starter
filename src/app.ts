import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { CONFIG } from '~/config';
import connectDb from '~/helpers/connect-db';
import logger from '~/helpers/logger';
import registerRoutes from '~/register-routes';

const app = express();

const corsOptions: cors.CorsOptions = {
	allowedHeaders: ['x-refresh', 'Content-Type', 'Authorization'],
	exposedHeaders: ['x-access-token'],
};

// TODO Modify origin to correct production origin
if (CONFIG.env === 'production') 
	corsOptions.origin = 'example.com';


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(pinoHttp({ logger }));

const server = app.listen(CONFIG.port, async () => {
	logger.info(`App is running at http://localhost:${CONFIG.port}`);
	connectDb();
	registerRoutes(app);
});

server.on('error', (error) => {
	logger.fatal(error);
});

export default app;
