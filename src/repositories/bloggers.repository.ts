import { NoSqlRepositoryInterface } from '@app/interfaces';
import { bloggersCollection } from '../db';
import { BloggerInterface, BloggerResponseType, CreateBloggerType } from '../entities';
import { BloggerNameSearchParamType } from '../interfaces/search-param.interface';
import { MongoRepository } from './mongo.repository';

export class BloggerRepository
	extends MongoRepository<BloggerInterface>
	implements NoSqlRepositoryInterface<BloggerInterface>
{
	constructor() {
		super(bloggersCollection);
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

	async getAll(options: BloggerNameSearchParamType): Promise<BloggerResponseType[]> {
		const bloggersWithDBID = await this.collection
			.find({
				name: { $regex: options.name },
			})
			.skip(options.skip)
			.limit(options.pageSize)
			.toArray();

		return bloggersWithDBID.map(this.convertMongoEntityToResponse);
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
		return !!result.matchedCount;
	}

	async countCollectionByRegExp(key: keyof BloggerInterface, regexp: RegExp): Promise<number> {
		return this.collection.countDocuments({ [key]: { $regex: regexp } });
	}
}
