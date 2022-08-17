import { RepositoryInterface } from '@app/interfaces';
import { idGenerator } from '../helpers/id-generator';

export class Repository<T extends { id: number }>
	implements RepositoryInterface<T>
{
	private readonly database: T[];

	constructor(database: T[]) {
		this.database = database;
	}

	/**
	 * Finds all entities from Database
	 */
	async getAll() {
		return this.database;
	}

	/**
	 * Creates new entity in database
	 * @param data
	 */
	async create<T>(data: any) {
		const entity = { id: idGenerator(), ...data };
		this.database.push(entity);
		return entity;
	}

	/**
	 * Finds one entity by ID from database
	 * @param id
	 */
	async getById(id: number) {
		const candidate = this.database.find((entity) => entity.id === id);
		return candidate || null;
	}

	/**
	 * Update one entity by ID in database
	 * @param id
	 * @param data
	 */
	async update(id: number, data: keyof T): Promise<boolean> {
		const candidate = await this.getById(id);
		if (!candidate) {
			return false;
		}

		Object.assign(candidate, data);

		return true;
	}

	/**
	 * Remove one entity by ID from database
	 * @param id
	 */
	async removeById(id: number) {
		const candidateIndex = this.database.findIndex(
			(entity) => entity.id === id,
		);
		this.database.splice(candidateIndex, 1);
	}

	/**
	 * Drops full database
	 */
	async drop() {
		this.database.splice(0, this.database.length);
	}
}
