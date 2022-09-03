import { PaginationInterface } from './pagination.interface';
import { BloggerInterface, PostInterface } from '../entities';
import { SortDirectionEnum } from '@app/enums';

export interface BloggerQueryBuilderResponseInterface extends PaginationInterface {
	searchNameTerm: RegExp;
	sortBy: keyof BloggerInterface;
	sortDirection: SortDirectionEnum;
}

export interface PostsQueryBuilderResponseInterface extends PaginationInterface {
	bloggerId: string | null;
	sortBy: keyof PostInterface;
	sortDirection: SortDirectionEnum;
}
