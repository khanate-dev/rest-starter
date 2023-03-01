import type { EchoSchema } from '~/schemas/general';
import type { UnAuthenticatedHandler } from '~/types';

export const echoHandler: UnAuthenticatedHandler<EchoSchema> = async () => ({
	success: true,
	message: 'The server can be reached',
});
