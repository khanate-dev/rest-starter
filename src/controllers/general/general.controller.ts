import { EchoSchema } from '~/schemas/general';

import { PublicHandler } from '~/types';

export const echoHandler: PublicHandler<EchoSchema> = async () => ({
	success: true,
	message: 'The server can be reached',
});