import { SortDirectionEnum } from '@app/enums';

export interface PaginationInterface {
	pageSize: number;
	pageNumber: number;
	skip: number;
}

export interface SortInterface<Entity> {
	sortBy: keyof Entity;
	sortDirection: SortDirectionEnum;
}
