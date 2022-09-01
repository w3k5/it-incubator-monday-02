import { BloggerInterface } from './entities';

declare namespace Express {
	export interface Request {
		blogger?: BloggerInterface;
	}
}
