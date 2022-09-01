import { MongoRepository } from './mongo.repository';
import { UserDatabaseType, UserInterface } from '../entities';
import { NoSqlRepositoryInterface } from '@app/interfaces';
import { usersCollection } from '../db';

export class UserRepository extends MongoRepository<UserInterface> implements NoSqlRepositoryInterface<UserInterface> {
	constructor() {
		super(usersCollection);
	}

	async create(data: UserInterface): Promise<UserDatabaseType> {
		const { insertedId } = await this.collection.insertOne(data);
		return this.convertMongoEntityToResponse({ ...data, _id: insertedId });
	}

	async getAll({ pageNumber, pageSize, skip }: any): Promise<UserDatabaseType[]> {
		const usersWithDBID = await this.collection.find({}).skip(skip).limit(pageSize).toArray();
		return usersWithDBID.map(this.convertMongoEntityToResponse);
	}

	async getById(id: string): Promise<UserDatabaseType | null> {
		const candidate = await this.collection.findOne({ _id: this.convertIdToObjectId(id) });
		if (!candidate) return null;
		const { _id, ...user } = candidate;
		return {
			...user,
			id: _id.toString(),
		};
	}

	async removeById(id: string): Promise<boolean> {
		const { deletedCount } = await this.collection.deleteOne({ _id: this.convertIdToObjectId(id) });
		return !!deletedCount;
	}

	update(id: string, data: Omit<UserInterface, 'id'>): Promise<boolean> {
		return Promise.resolve(false);
	}
}
