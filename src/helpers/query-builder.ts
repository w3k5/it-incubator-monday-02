import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { BloggerQueryBuilderResponseInterface } from '../interfaces/query-builder.interface';
import { PostBloggerIdSearchParamType } from '../interfaces/search-param.interface';

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
// export const queryBuilder = (request: Request<GetAllBloggersType>): BloggerQueryBuilderResponseInterface => {
export const queryBuilder = (request: Request): BloggerQueryBuilderResponseInterface => {
	const { SearchNameTerm: nameQuery, PageNumber: pageNumberQuery, PageSize: pageSizeQuery } = request.query;
	const searchNameTerm = nameQuery ? nameQuery.toString() : '.*';
	const paginationResult = paginationQueryBuilder(Number(pageNumberQuery), Number(pageSizeQuery));
	return {
		searchNameTerm: new RegExp(searchNameTerm),
		...paginationResult,
	};
};

/**
 * @deprecated
 */
export const postsQueryBuilder = (request: Request): PostBloggerIdSearchParamType => {
	const { PageNumber: pageNumberQuery, PageSize: pageSizeQuery } = request.query;
	// const bloggerId = request.params.id ? new ObjectId(request.params.id) : null;
	const bloggerId = request.params.id ? +request.params.id : null;
	const paginationResult = paginationQueryBuilder(Number(pageNumberQuery), Number(pageSizeQuery));
	return {
		bloggerId,
		...paginationResult,
	};
};
