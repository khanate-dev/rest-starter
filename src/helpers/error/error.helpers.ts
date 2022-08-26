import { ErrorResponse } from '~/types';

interface ErrorResponseAndCode {
	status: number,
	json: ErrorResponse,
};

export const getErrorResponseAndCode = (error: any): ErrorResponseAndCode => ({
	status: error.code ?? 500,
	json: {
		...error,
		type: error?.name,
		message: error?.message ?? error,
	},
});