import { EchoSchema } from '~/schemas/general';

import { UnAuthenticatedHandler } from '~/types';

export const echoHandler: UnAuthenticatedHandler<EchoSchema> = async () => ({
	success: true,
	message: 'The server can be reached',
});
