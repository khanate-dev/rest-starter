import { ErrorResponse, Status } from '~/types';

interface ErrorResponseAndCode {
	status: Status,
	json: ErrorResponse,
}

export const getErrorResponse = (
	error: any
): ErrorResponse => ({
	...error,
	type: error?.name,
	message: error?.message ?? error,
});

export const getErrorResponseAndCode = (
	error: any,
	defaultStatus: Status = Status.INTERNAL_SERVER_ERROR
): ErrorResponseAndCode => ({
	status: error.statusCode ?? defaultStatus,
	json: getErrorResponse(error),
});