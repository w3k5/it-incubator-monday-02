import { PaginationInterface } from './pagination.interface';

export interface BloggerQueryBuilderResponseInterface extends PaginationInterface {
	searchNameTerm: RegExp;
}

export interface PostsQueryBuilderResponseInterface extends PaginationInterface {
	bloggerId: number | null;
}
