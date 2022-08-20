import { NoSqlRepositoryInterface } from '@app/interfaces';
import { bloggersCollection } from '../db';
import { BloggerInterface, BloggerResponseType, CreateBloggerType } from '../entities';
import { BloggerNameSearchParamType } from '../interfaces/search-param.interface';
import { MongoRepository } from './mongo.repository';
import { BloggerQueryBuilderResponseInterface } from '../interfaces/query-builder.interface';

export class BloggerRepository
	extends MongoRepository<BloggerInterface>
	implements NoSqlRepositoryInterface<BloggerInterface>
{
	constructor() {
		super(bloggersCollection);
	}

	async create(data: CreateBloggerType): Promise<BloggerResponseType> {
		const id = Date.now();
		// const createdAt = new Date().toISOString();
		await this.collection.insertOne({
			id,
			// createdAt,
			...data,
		});
		return {
			id,
			// createdAt,
			...data,
		};
	}

	async getAll(options: BloggerQueryBuilderResponseInterface): Promise<BloggerResponseType[]> {
		const bloggersWithDBID = await this.collection
			.find({
				name: { $regex: options.searchNameTerm },
			})
			.skip(options.skip)
			.limit(options.pageSize)
			.toArray();

		const converted = bloggersWithDBID.map(this.convertMongoEntityToResponse);
		return converted;
	}

	async getById(id: number): Promise<BloggerResponseType | null> {
		const candidate = await this.collection.findOne({ id });
		if (candidate) {
			const { _id, ...blogger } = candidate;
			return {
				...blogger,
			};
		}

		return null;
	}

	async removeById(id: number): Promise<void> {
		await this.collection.deleteOne({ id: +id });
	}

	async update(id: number, data: CreateBloggerType): Promise<boolean> {
		// const convertedId = this.convertIdToObjectId(id);
		const result = await this.collection.updateOne({ id: id }, { $set: { ...data } });
		return !!result.matchedCount;
	}

	async countCollectionByRegExp(key: keyof BloggerInterface, regexp: RegExp): Promise<number> {
		return this.collection.countDocuments({ [key]: { $regex: regexp } });
	}
}
