import { Request, Response } from 'express';
import { SortDirectionEnum } from '@app/enums';

export type RequestWithBody<Body> = Request<never, never, Body, never>;
export type RequestWithQuery<Query> = Request<never, never, never, Query>;
export type RequestWithParams<Params> = Request<Params>;
export type RequestWithBodyAndParams<Body, Params> = Request<Params, never, Body, never>;

export type EmptyResponse = Response<any>;
export type Nullable<T> = T | null;

// Общий тип пагинации
export type PaginationParams = { pageSize: number; pageNumber: number };

// Общий тип сортировки
export interface SortInterface<Entity> {
	sortBy: keyof Entity;
	sortDirection: SortDirectionEnum;
}

export type GetAllEntities<Entity> = {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: Entity[];
};

export type EntityId = {
	id: DatabaseId;
};

export type DatabaseId = string;

export type ServerError = {
	status: number;
	message: 'Internal server error';
	error: string;
	route: string;
	endpoint: string;
};

// export interface GetAllResponseInterface<Entity> {
// 	pagesCount: number;
// 	page: number;
// 	pageSize: number;
// 	totalCount: number;
// 	items: Entity[];
// }
