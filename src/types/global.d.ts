import type { JwtPayload } from '~/helpers/auth';

type Obj = Record<string, unknown>;
type EmptyObj = Record<string, never>;

declare global {
	namespace Express {
		interface Locals {
			user: JwtPayload;
		}
	}
}
