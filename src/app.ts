import express from 'express';
import pinoMiddleWare from 'express-pino-logger';
import helmet from 'helmet';

import config from '~/config';

import connectDb from '~/helpers/connect-db';
import logger from '~/helpers/logger';

import registerRoutes from '~/register-routes';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

if (config.env === 'production') {
	app.use(pinoMiddleWare({ logger }));
}

const server = app.listen(config.port, async () => {
	logger.info(`App is running at http://localhost:${config.port}`);
	await connectDb();
	registerRoutes(app);
});

server.on('error', (error) => {
	logger.fatal(error);
});

export default app;