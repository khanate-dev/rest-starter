import { ErrorResponse, Status } from '~/types';

interface ErrorResponseAndCode {
	status: Status,
	json: ErrorResponse,
}

export const getErrorResponseAndCode = (
	error: any,
	defaultStatus: Status = Status.INTERNAL_SERVER_ERROR
): ErrorResponseAndCode => ({
	status: error.code ?? defaultStatus,
	json: {
		...error,
		type: error?.name,
		message: error?.message ?? error,
	},
});