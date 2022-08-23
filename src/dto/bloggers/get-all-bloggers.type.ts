import { PaginationParams } from '../common/common.types';

type GetAllBloggersQueryType = {
	SearchNameTerm: string;
};

export type GetAllBloggersQueryParams = PaginationParams & GetAllBloggersQueryType;
