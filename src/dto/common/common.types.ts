import { Request, Response } from 'express';
import * as core from 'express-serve-static-core';

type ParamsDictionary = core.ParamsDictionary & { [key: string]: number };

export type RequestWithBody<Body> = Request<never, never, Body, never>;
export type RequestWithQuery<Query> = Request<never, never, never, Query>;
export type RequestWithParams<Params extends ParamsDictionary> = Request<Params, never, never, never>;
export type RequestWithBodyAndParams<Body, Params extends ParamsDictionary> = Request<Params, never, Body, never>;
export type RequestWithParamsAndQuery<Params, Query> = Request<Params, never, never, Query>;

export type EmptyResponse = Response<never>;
export type EmptyRequest = Request<never, never, never, never, never>;

// Общий тип пагинации
export type PaginationParams = { PageSize: number; PageNumber: number };

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

export type DatabaseId = number;
