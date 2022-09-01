import { Status } from '~/types';

const defaultMessage = 'Something went wrong';

const messages: Partial<Record<Status, string>> = {
	401: 'Not logged in',
	403: 'You do not have permission to perform this action',
	404: 'Resource not found',
};

class ApiError extends Error {

	code: Status;

	constructor(
		code: Status,
		message?: string,
		options?: ErrorOptions
	) {
		super(
			message ?? messages[code] ?? defaultMessage,
			options
		);
		this.code = code;
	}

}

export default ApiError;