import { Request, Response } from 'express';
import * as core from 'express-serve-static-core';

export type RequestWithBody<Body> = Request<never, never, Body, never>;
export type RequestWithQuery<Query> = Request<never, never, never, Query>;
export type RequestWithParams<Params> = Request<Params>;
export type RequestWithBodyAndParams<Body, Params> = Request<Params, never, Body, never>;
export type RequestWithParamsAndQuery<Params, Query> = Request<Params, never, never, Query>;

export type EmptyResponse = Response<never>;
export type EmptyRequest = Request<never, never, never, never, never>;
export type Nullable<T> = T | null;

// Общий тип пагинации
export type PaginationParams = { pageSize: number; pageNumber: number };

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
