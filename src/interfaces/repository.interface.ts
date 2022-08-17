export interface RepositoryInterface<Entity> {
	getAll: () => Promise<Entity[]>;
	getById: (id: number) => Promise<Entity | null>;
	create: <T>(data: T) => Promise<Entity>;
	update: (id: number, data: keyof Entity) => Promise<boolean>;
	removeById: (id: number) => Promise<void>;
	drop: () => Promise<void>;
}
