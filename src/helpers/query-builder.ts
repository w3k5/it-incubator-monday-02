import { BloggerQueryBuilderResponseInterface } from '../interfaces/query-builder.interface';
import { GetAllBloggersQueryParams } from '../dto/bloggers/get-all-bloggers.type';
import { RequestWithQuery } from '@app/common-types';

/**
 * @deprecated
 */
export const paginationQueryBuilder = (pageNumber = 1, pageSize = 10) => {
	const validatedPageNumber = pageNumber ? pageNumber : 1;
	const validatedPageSize = pageSize ? pageSize : 10;
	const skip = (validatedPageNumber - 1) * validatedPageSize;
	return {
		pageNumber,
		pageSize,
		skip,
	};
};

/**
 * @deprecated
 */
export const queryBuilder = (
	request: RequestWithQuery<GetAllBloggersQueryParams>,
): BloggerQueryBuilderResponseInterface => {
	const {
		SearchNameTerm: nameQuery,
		pageNumber: pageNumberQuery,
		pageSize: pageSizeQuery,
		sortBy,
		sortDirection,
	} = request.query;
	const searchNameTerm = nameQuery ? nameQuery.toString() : '.*';
	const paginationResult = paginationQueryBuilder(Number(pageNumberQuery), Number(pageSizeQuery));
	return {
		searchNameTerm: new RegExp(searchNameTerm),
		sortBy,
		sortDirection,
		...paginationResult,
	};
};

/**
 * @deprecated
 */
// export const postsQueryBuilder = (request: Request): PostBloggerIdSearchParamType => {
// 	const { pageNumber: pageNumberQuery, pageSize: pageSizeQuery } = request.query;
// 	// const bloggerId = request.params.id ? new ObjectId(request.params.id) : null;
// 	const bloggerId = request.params.id ? +request.params.id : null;
// 	const paginationResult = paginationQueryBuilder(Number(pageNumberQuery), Number(pageSizeQuery));
// 	return {
// 		bloggerId,
// 		...paginationResult,
// 	};
// };
