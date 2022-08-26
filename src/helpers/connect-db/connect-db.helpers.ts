import mongoose from 'mongoose';

import config from '~/config';

import logger from '~/helpers/logger';

const connectDb = async () => {
	try {
		const connection = await mongoose.connect(config.dbUri);
		logger.info('Connected to DB');
		return connection;
	}
	catch (error: any) {
		throw new Error(`Error Connecting to DB: ${error.message}`);
	}
};

export default connectDb;