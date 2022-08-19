import { Collection, ObjectId } from 'mongodb';
import { NoSqlRepositoryInterface } from '@app/interfaces';
import { postsCollection } from '../db';
import { PostInterface, PostsResponseType } from '../entities';

export class PostsRepository implements NoSqlRepositoryInterface<PostInterface> {
	private readonly collection: Collection<PostInterface>;

	constructor() {
		this.collection = postsCollection;
	}

	async create(data: Omit<PostInterface, 'id'>): Promise<PostsResponseType> {
		const { bloggerName, title, shortDescription, content, bloggerId } = data;

		const { insertedId } = await this.collection.insertOne(data);

		const post = {
			id: insertedId.toString(),
			bloggerName,
			title,
			shortDescription,
			content,
			bloggerId,
		};
		return post;
	}

	async drop(): Promise<void> {
		await this.collection.drop();
	}

	async getAll(): Promise<PostsResponseType[]> {
		const postsWithDBID = await this.collection.find({}).toArray();
		const responseArray: PostsResponseType[] = postsWithDBID.map(({ _id, ...post }) => {
			return {
				id: _id.toString(),
				...post,
			};
		});
		return responseArray;
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
		return result.matchedCount === 1;
	}

	private convertIdToObjectId = (id: string) => {
		return new ObjectId(id);
	};
}
