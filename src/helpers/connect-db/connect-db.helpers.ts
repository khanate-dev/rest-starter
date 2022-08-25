import mongoose from 'mongoose';
import config from 'config';

import logger from '~/helpers/logger';

const connectDb = async () => {
	try {
		const dbUri = config.get<string>('dbUri');
		const connection = await mongoose.connect(dbUri);
		logger.info('Connected to DB');
		return connection;
	}
	catch (error) {
		logger.fatal('Could Not Connect To DB');
		process.exit(1);
	}
};

export default connectDb;