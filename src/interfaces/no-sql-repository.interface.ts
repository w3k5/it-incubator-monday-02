import { RepositoryInterface } from './repository.interface';

export interface NoSqlRepositoryInterface<Entity> extends RepositoryInterface<Entity> {
	/**
	 * Returns one Entity in Database by ID
	 * @param id string filter param
	 * @returns Entity or null
	 */
	// getById(id: string): Promise<Entity | null>;
	getById(id: number): Promise<Entity | null>;

	/**
	 * Updates one Entity in Database by ID
	 * @param id number filter param
	 * @param data Entity without ID
	 * @returns Result status - true or false
	 */
	// update(id: string, data: Omit<Entity, 'id'>): Promise<boolean>;
	update(id: number, data: Omit<Entity, 'id'>): Promise<boolean>;

	/**
	 * Removes one Entity by ID from Database
	 * @param id
	 * @returns Promise<void>
	 */
	removeById(id: number): Promise<void>;
}
