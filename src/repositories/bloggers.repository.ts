import { NoSqlRepositoryInterface } from '@app/interfaces';
import { bloggersCollection } from '../db';
import { BloggerInterface, BloggerResponseType } from '../entities';
import { MongoRepository } from './mongo.repository';
import { BloggerQueryBuilderResponseInterface } from '../interfaces/query-builder.interface';
import { CreateBloggerDto } from '../dto/bloggers/create-blogger.dto';
import { UpdateBloggerDto } from '../dto/bloggers/update-blogger.dto';
import { SortDirectionEnum } from '../enums';

export class BloggerRepository
	extends MongoRepository<Omit<BloggerInterface, 'id'>>
	implements NoSqlRepositoryInterface<BloggerInterface>
{
	constructor() {
		super(bloggersCollection);
	}

	async create({ name, youtubeUrl }: CreateBloggerDto): Promise<BloggerResponseType> {
		const createdAt = this.dateNow();
		const { insertedId } = await this.collection.insertOne({
			name,
			youtubeUrl,
			createdAt,
		});
		return {
			id: insertedId.toString(),
			name,
			youtubeUrl,
			createdAt,
		};
	}

	async getAll(options: BloggerQueryBuilderResponseInterface): Promise<BloggerResponseType[]> {
		const sortDirection = options.sortDirection === SortDirectionEnum.Asc ? 1 : -1;

		const bloggersWithDBID = await this.collection
			.find({
				name: { $regex: options.searchNameTerm, $options: 'i' },
			})
			.sort({ [options.sortBy]: sortDirection })
			.skip(options.skip)
			.limit(options.pageSize)
			.toArray();

		const converted = bloggersWithDBID.map(this.convertMongoEntityToResponse);
		return converted;
	}

	async getById(id: string): Promise<BloggerResponseType | null> {
		const candidate = await this.collection.findOne({ _id: this.convertIdToObjectId(id) });
		if (candidate) {
			const { name, youtubeUrl, createdAt } = candidate;
			return {
				id,
				name,
				youtubeUrl,
				createdAt,
			};
		}

		return null;
	}

	async removeById(id: string): Promise<boolean> {
		const { deletedCount } = await this.collection.deleteOne({ _id: this.convertIdToObjectId(id) });
		return !!deletedCount;
	}

	async update(id: string, { name, youtubeUrl }: UpdateBloggerDto): Promise<boolean> {
		const result = await this.collection.updateOne(
			{ _id: this.convertIdToObjectId(id) },
			{ $set: { name, youtubeUrl } },
		);
		return !!result.matchedCount;
	}

	async countCollectionByRegExp(key: keyof BloggerInterface, regexp: RegExp): Promise<number> {
		return this.collection.countDocuments({ [key]: { $regex: regexp } });
	}
}
