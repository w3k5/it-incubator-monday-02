import { PaginationInterface } from './pagination.interface';
import { ObjectId } from 'mongodb';

export type SearchParamType<Filter> = PaginationInterface & Filter;

interface BloggerFilterInterface {
	name: RegExp;
}

interface PostFilterInterface {
	bloggerId: ObjectId | null;
}

export type BloggerNameSearchParamType = SearchParamType<BloggerFilterInterface>;

export type PostBloggerIdSearchParamType = SearchParamType<PostFilterInterface>;
