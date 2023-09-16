import type { JwtPayload } from '~/helpers/auth.helpers';

declare global {
	namespace Express {
		interface Locals {
			user?: JwtPayload;
		}
	}
}
