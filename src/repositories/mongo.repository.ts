import { Collection, ObjectId } from 'mongodb';

export class MongoRepository<Entity> {
	collection: Collection<Entity>;

	constructor(collection: Collection<Entity>) {
		this.collection = collection;
	}

	convertIdToObjectId = (id: string) => {
		return new ObjectId(id);
	};

	async countAllDocuments(): Promise<number> {
		return this.collection.countDocuments();
	}

	convertMongoEntityToResponse = (entity: Entity & { _id: ObjectId }) => {
		const { _id, ...rest } = entity;
		return {
			// _id: _id.toString(),
			...rest,
		};
	};

	async drop(): Promise<void> {
		await this.collection.drop();
	}
}
