import type { Status } from '~/helpers/http';

const DEFAULT_MESSAGE = 'Something went wrong';

const MESSAGES: Partial<Record<Status, string>> = {
	401: 'Not logged in',
	403: 'You do not have permission to perform this action',
	404: 'Resource not found',
};
/* eslint-enable @typescript-eslint/naming-convention */

export class ApiError extends Error {
	status: Status;
	constructor(status: Status, message?: string, options?: ErrorOptions) {
		super(message ?? MESSAGES[status] ?? DEFAULT_MESSAGE, options);
		this.status = status;
	}
}
