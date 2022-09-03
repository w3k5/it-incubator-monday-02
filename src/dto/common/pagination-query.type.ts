import { RequestWithQuery } from './common.types';

/**
 * @deprecated
 */
interface PaginationInterface {
	pageNumber: number;
	pageSize: number;
}

/**
 * @deprecated
 */
export type PaginationQueryType<T> = RequestWithQuery<PaginationInterface & T>;
