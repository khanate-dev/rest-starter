import type { JwtPayload } from '~/helpers/auth';

declare global {
	namespace Express {
		interface Locals {
			user?: JwtPayload;
		}
	}
}
