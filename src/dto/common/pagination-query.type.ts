import { RequestWithQuery } from './common.types';

/**
 * @deprecated
 */
interface PaginationInterface {
	PageNumber: number;
	PageSize: number;
}

/**
 * @deprecated
 */
export type PaginationQueryType<T> = RequestWithQuery<PaginationInterface & T>;
