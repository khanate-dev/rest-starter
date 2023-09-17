import type { JwtPayload } from '~/helpers/auth.helpers.js';

declare global {
	namespace Express {
		interface Locals {
			user?: JwtPayload;
		}
	}
}
