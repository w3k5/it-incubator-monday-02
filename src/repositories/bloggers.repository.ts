import { NoSqlRepositoryInterface } from '@app/interfaces';
import { bloggersCollection } from '../db';
import { BloggerInterface, BloggerResponseType, CreateBloggerType } from '../entities';
import { MongoRepository } from './mongo.repository';
import { BloggerQueryBuilderResponseInterface } from '../interfaces/query-builder.interface';
import { CreateBloggerDto } from '../dto/bloggers/create-blogger.dto';
import { UpdateBloggerDto } from '../dto/bloggers/update-blogger.dto';

export class BloggerRepository
	extends MongoRepository<BloggerInterface>
	implements NoSqlRepositoryInterface<BloggerInterface>
{
	constructor() {
		super(bloggersCollection);
	}

	async create({ name, youtubeUrl }: CreateBloggerDto): Promise<BloggerResponseType> {
		const id = Date.now();
		// const createdAt = new Date().toISOString();
		await this.collection.insertOne({
			id,
			// createdAt,
			name,
			youtubeUrl,
		});
		return {
			id,
			// createdAt,
			name,
			youtubeUrl,
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
			const { _id, name, youtubeUrl } = candidate;
			return {
				id,
				name,
				youtubeUrl,
			};
		}

		return null;
	}

	async removeById(id: number): Promise<void> {
		await this.collection.deleteOne({ id });
	}

	async update(id: number, { name, youtubeUrl }: UpdateBloggerDto): Promise<boolean> {
		// const convertedId = this.convertIdToObjectId(id);
		const result = await this.collection.updateOne({ id: id }, { $set: { name, youtubeUrl } });
		return !!result.matchedCount;
	}

	async countCollectionByRegExp(key: keyof BloggerInterface, regexp: RegExp): Promise<number> {
		return this.collection.countDocuments({ [key]: { $regex: regexp } });
	}
}
