import { PaginationParams } from '@app/common-types';
import { PostInterface } from '../../entities';
import { SortDirectionEnum } from '@app/enums';

type GetAllPostsQueryType = {
	sortBy: keyof PostInterface;
	sortDirection: SortDirectionEnum;
};

export type GetAllPostsQueryParams = PaginationParams & GetAllPostsQueryType;
