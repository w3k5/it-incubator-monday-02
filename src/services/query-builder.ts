import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { BloggerQueryBuilderResponseInterface } from '../interfaces/query-builder.interface';
import { PostBloggerIdSearchParamType } from '../interfaces/search-param.interface';

export const queryBuilder = (request: Request): BloggerQueryBuilderResponseInterface => {
	const { name: nameQuery, PageNumber: pageNumberQuery, PageSize: pageSizeQuery } = request.query;
	const name = nameQuery ? nameQuery.toString() : '.*';
	const pageNumber = pageNumberQuery ? +pageNumberQuery : 1;
	const pageSize = pageSizeQuery ? +pageSizeQuery : 10;
	const skip = (pageNumber - 1) * pageSize;
	return {
		name: new RegExp(name),
		pageNumber,
		pageSize,
		skip,
	};
};

export const postsQueryBuilder = (request: Request): PostBloggerIdSearchParamType => {
	const { PageNumber: pageNumberQuery, PageSize: pageSizeQuery } = request.query;
	// const bloggerId = request.params.id ? new ObjectId(request.params.id) : null;
	const bloggerId = request.params.id ? +request.params.id : null;
	const pageNumber = pageNumberQuery ? +pageNumberQuery : 1;
	const pageSize = pageSizeQuery ? +pageSizeQuery : 10;
	const skip = (pageNumber - 1) * pageSize;
	return {
		bloggerId,
		pageNumber,
		pageSize,
		skip,
	};
};
