import { AuthUserTokenInterface } from './_common/types';

declare namespace Express {
	export interface Request {
		user?: any;
	}
}
