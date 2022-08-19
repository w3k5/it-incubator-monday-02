import { Collection, ObjectId } from 'mongodb';
import { NoSqlRepositoryInterface } from '@app/interfaces';
import { bloggersCollection } from '../db';
import { BloggerInterface, BloggerResponseType, CreateBloggerType } from '../entities';

export class BloggerRepository implements NoSqlRepositoryInterface<BloggerInterface> {
	private readonly collection: Collection<BloggerInterface>;

	constructor() {
		this.collection = bloggersCollection;
	}

	async create({ youtubeUrl, name }: CreateBloggerType): Promise<BloggerResponseType> {
		const { insertedId } = await this.collection.insertOne({ name, youtubeUrl });

		return {
			name,
			youtubeUrl,
			id: insertedId.toString(),
		};
	}

	async drop(): Promise<void> {
		await this.collection.drop();
	}

	async getAll(): Promise<BloggerResponseType[]> {
		const bloggersWithDBID = await this.collection.find({}).toArray();
		const responseArray: BloggerResponseType[] = bloggersWithDBID.map(({ _id, ...blogger }) => {
			return {
				id: _id.toString(),
				...blogger,
			};
		});
		return responseArray;
	}

	async getById(id: string): Promise<BloggerResponseType | null> {
		const convertedId = this.convertIdToObjectId(id);
		const candidate = await this.collection.findOne({ _id: convertedId });
		if (candidate) {
			const { _id, ...blogger } = candidate;
			return {
				id: _id.toString(),
				...blogger,
			};
		}

		return null;
	}

	async removeById(id: string): Promise<void> {
		const convertedId = this.convertIdToObjectId(id);
		await this.collection.deleteOne({ _id: convertedId });
	}

	async update(id: string, data: CreateBloggerType): Promise<boolean> {
		const convertedId = this.convertIdToObjectId(id);
		const result = await this.collection.updateOne({ _id: convertedId }, { $set: { ...data } });
		return result.matchedCount === 1;
	}

	private convertIdToObjectId = (id: string) => {
		return new ObjectId(id);
	};
}
