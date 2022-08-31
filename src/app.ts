import express from 'express';
import pinoMiddleWare from 'express-pino-logger';
import helmet from 'helmet';

import config from '~/config';

import connectDb from '~/helpers/connect-db';
import logger from '~/helpers/logger';

import routes from '~/routes';


const app = express();

app.use(express.json());
app.use(helmet());
app.use(pinoMiddleWare({
	logger,
}));

const server = app.listen(config.port, async () => {
	logger.info(`App is running at http://localhost:${config.port}`);
	await connectDb();
	routes(app);
});

server.on('error', (error) => {
	logger.fatal(error);
});

export default app;