import type { EchoSchema } from '~/schemas/general';
import type { UnAuthenticatedHandler } from '~/types';

export const echoHandler: UnAuthenticatedHandler<EchoSchema> = async () => ({
	message: 'The server can be reached',
	success: true,
});
