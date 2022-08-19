import { RepositoryInterface } from '@app/interfaces';
import { idGenerator } from '../helpers';
import { MockRepository } from '../interfaces/mock-repository';

export class Repository<T extends { id: number }> implements MockRepository<T> {
	private readonly database: T[];

	constructor(database: T[]) {
		this.database = database;
	}

	async getAll() {
		return this.database;
	}

	async create(data: Omit<T, 'id'>) {
		const entity: any = { id: idGenerator(), ...data };
		this.database.push(entity);
		return entity;
	}

	async getById(id: number) {
		const candidate = this.database.find((entity) => entity.id === id);
		return candidate || null;
	}

	async update(id: number, data: Omit<T, 'id'>): Promise<boolean> {
		const candidate = await this.getById(id);
		if (!candidate) {
			return false;
		}

		Object.assign(candidate, data);

		return true;
	}

	async removeById(id: number) {
		const candidateIndex = this.database.findIndex((entity) => entity.id === id);
		this.database.splice(candidateIndex, 1);
	}

	async drop() {
		this.database.splice(0, this.database.length);
	}
}
