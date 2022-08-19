import { SearchParamType } from './search-param.interface';

export interface RepositoryInterface<Entity> {
	/**
	 * Finds all entities from Database
	 */
	getAll(searchParams?: SearchParamType<Entity & any>): Promise<Entity[]>;

	/**
	 * Creates one Entity in Database
	 * @param data Entity without ID
	 * @returns new Entity
	 */
	create(data: Omit<Entity, 'id'>): Promise<Entity>;

	/**
	 * Drops full database
	 */
	drop(): Promise<void>;
}
