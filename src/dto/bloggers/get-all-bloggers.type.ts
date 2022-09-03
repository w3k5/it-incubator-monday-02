import { PaginationParams } from '../common/common.types';
import { SortDirectionEnum } from '../../enums';
import { BloggerInterface } from '../../entities';

type GetAllBloggersQueryType = {
	searchNameTerm: string;
	sortBy: keyof BloggerInterface;
	sortDirection: SortDirectionEnum;
};

export type GetAllBloggersQueryParams = PaginationParams & GetAllBloggersQueryType;
