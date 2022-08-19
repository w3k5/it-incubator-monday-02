import { PaginationInterface } from './pagination.interface';

export interface BloggerQueryBuilderResponseInterface extends PaginationInterface {
	name: RegExp;
}

export interface PostsQueryBuilderResponseInterface extends PaginationInterface {
	bloggerId: string | null;
}
