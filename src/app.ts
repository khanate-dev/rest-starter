import express from 'express';
import config from 'config';

import connectDb from '~/helpers/connect-db';
import logger from '~/helpers/logger';

import routes from '~/routes';

const port = config.get<number>('port');

const app = express();

app.use(express.json());

app.listen(port, async () => {
	logger.info(`App is running at http://localhost:${port}`);
	await connectDb();
	routes(app);
});

export default app;