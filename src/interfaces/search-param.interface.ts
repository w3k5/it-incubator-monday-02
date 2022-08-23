import { PaginationInterface } from './pagination.interface';
import { ObjectId } from 'mongodb';

export type SearchParamType<Filter> = PaginationInterface & Filter;
