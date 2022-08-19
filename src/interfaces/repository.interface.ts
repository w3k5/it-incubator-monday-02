export interface RepositoryInterface<Entity> {
	/**
	 * Finds all entities from Database
	 */
	getAll(): Promise<Entity[]>;

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
