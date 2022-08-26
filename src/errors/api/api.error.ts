// // type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
// // type OneToFour = 1 | 2 | 3 | 4;
// // type HttpCode = `${OneToFour}${Digit}${Digit}`;

const defaultMessage = 'Something went wrong';

const messages: Record<string, string> = {
	403: 'You do not have permission to perform this action',
	404: 'Resource not found',
};

class ApiError extends Error {
	code: number;
	constructor(code: number, message?: string, options?: ErrorOptions) {
		super(
			message ?? messages[code] ?? defaultMessage,
			options
		);
		this.code = code;
	}
}

export default ApiError;