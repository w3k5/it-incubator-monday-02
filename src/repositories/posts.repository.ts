import { NoSqlRepositoryInterface } from '@app/interfaces';
import { PostInterface, PostsResponseType } from '../entities';
import { MongoRepository } from './mongo.repository';
import { postsCollection } from '../db';
import { PostBloggerIdSearchParamType } from '../interfaces/search-param.interface';
import { ObjectId } from 'mongodb';

export class PostsRepository extends MongoRepository<PostInterface> implements NoSqlRepositoryInterface<PostInterface> {
	constructor() {
		super(postsCollection);
	}

	async create(data: Omit<PostInterface, 'id'>): Promise<PostsResponseType> {
		const { bloggerName, title, shortDescription, content, bloggerId } = data;

		const { insertedId } = await this.collection.insertOne(data);

		return {
			id: insertedId.toString(),
			bloggerName,
			title,
			shortDescription,
			content,
			bloggerId,
		};
	}

	async drop(): Promise<void> {
		await this.collection.drop();
	}

	async getAll({ bloggerId: id, skip, pageSize }: PostBloggerIdSearchParamType): Promise<PostsResponseType[]> {
		const filter = id ? { bloggerId: id } : {};
		const postsWithDBID = await this.collection.find(filter).skip(skip).limit(pageSize).toArray();
		return postsWithDBID.map(this.convertMongoEntityToResponse);
	}

	async getById(id: string): Promise<PostsResponseType | null> {
		const convertedId = this.convertIdToObjectId(id);
		const candidate = await this.collection.findOne({ _id: convertedId });
		if (candidate) {
			const { _id, ...post } = candidate;
			return {
				id: _id.toString(),
				...post,
			};
		}

		return null;
	}

	async removeById(id: string): Promise<void> {
		const convertedId = this.convertIdToObjectId(id);
		await this.collection.deleteOne({ _id: convertedId });
	}

	async update(id: string, data: Partial<Omit<PostInterface, 'id'>>): Promise<boolean> {
		const convertedId = this.convertIdToObjectId(id);
		const result = await this.collection.updateOne({ _id: convertedId }, { $set: { ...data } });
		return !!result.matchedCount;
	}

	async countCollectionByRegExp(key: keyof PostInterface, regexp: RegExp): Promise<number> {
		return this.collection.countDocuments({ [key]: { $regex: regexp } });
	}

	async countByBloggerId(id: ObjectId): Promise<number> {
		return this.collection.countDocuments({ bloggerId: id });
	}
}
