import type { Status } from '~/types';

const DEFAULT_MESSAGE = 'Something went wrong';

/* eslint-disable @typescript-eslint/naming-convention */
const MESSAGES: Partial<Record<Status, string>> = {
	401: 'Not logged in',
	403: 'You do not have permission to perform this action',
	404: 'Resource not found',
};
/* eslint-enable @typescript-eslint/naming-convention */

export class ApiError extends Error {
	statusCode: Status;
	constructor(code: Status, message?: string, options?: ErrorOptions) {
		super(message ?? MESSAGES[code] ?? DEFAULT_MESSAGE, options);
		this.statusCode = code;
	}
}
