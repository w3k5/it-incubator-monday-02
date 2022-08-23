import { PaginationInterface } from '../interfaces/pagination.interface';

export const getAllResponseBuilder = <T>(
	{ pageNumber: page, pageSize }: PaginationInterface,
	items: T[],
	total: number,
) => {
	const pagesCount = Math.ceil(total / pageSize);
	return {
		pagesCount,
		page,
		pageSize,
		totalCount: total,
		items: items,
	};
};
