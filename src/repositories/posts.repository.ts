import { NoSqlRepositoryInterface } from '@app/interfaces';
import { PostInterface, PostsResponseType } from '../entities';
import { MongoRepository } from './mongo.repository';
import { postsCollection } from '../db';
import { ObjectId } from 'mongodb';
import { PostsQueryBuilderResponseInterface } from '../interfaces/query-builder.interface';

export class PostsRepository extends MongoRepository<PostInterface> implements NoSqlRepositoryInterface<PostInterface> {
	constructor() {
		super(postsCollection);
	}

	async create(data: Omit<PostInterface, 'id'>): Promise<PostsResponseType> {
		const id = Date.now();
		const createdAt = new Date().toISOString();

		const { bloggerName, title, shortDescription, content, bloggerId } = data;

		await this.collection.insertOne({
			id,
			...data,
			// createdAt
		});

		return {
			// createdAt,
			id,
			bloggerName,
			title,
			shortDescription,
			content,
			bloggerId,
		};
	}

	async getAll({
		pageNumber,
		pageSize,
		skip,
		bloggerId,
	}: PostsQueryBuilderResponseInterface): Promise<PostsResponseType[]> {
		// const filter = id ? { bloggerId: id.toString() } : {};
		const filter = bloggerId ? { bloggerId: bloggerId } : {};
		const postsWithDBID = await this.collection.find(filter).skip(skip).limit(pageSize).toArray();
		return postsWithDBID.map(this.convertMongoEntityToResponse);
	}

	// async getById(id: string): Promise<PostsResponseType | null> {
	async getById(id: number): Promise<PostsResponseType | null> {
		// const convertedId = this.convertIdToObjectId(id);
		// const candidate = await this.collection.findOne({ _id: convertedId });
		const candidate = await this.collection.findOne({ id });
		if (candidate) {
			const { _id, ...post } = candidate;
			return {
				// _id: _id.toString(),
				...post,
			};
		}

		return null;
	}

	async removeById(id: number): Promise<void> {
		await this.collection.deleteOne({ id: +id });
	}

	async update(id: number, data: Partial<Omit<PostInterface, 'id'>>): Promise<boolean> {
		// const convertedId = this.convertIdToObjectId(id);
		const result = await this.collection.updateOne({ id }, { $set: { ...data } });
		return !!result.matchedCount;
	}

	async countCollectionByRegExp(key: keyof PostInterface, regexp: RegExp): Promise<number> {
		return this.collection.countDocuments({ [key]: { $regex: regexp } });
	}

	// async countByBloggerId(id: ObjectId): Promise<number> {
	// 	return this.collection.countDocuments({ bloggerId: id.toString() });
	// }

	async countByBloggerId(id: number): Promise<number> {
		return this.collection.countDocuments({ bloggerId: id });
	}
}
