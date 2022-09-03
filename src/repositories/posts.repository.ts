import { NoSqlRepositoryInterface } from '@app/interfaces';
import { PostInterface, PostsResponseType } from '../entities';
import { MongoRepository } from './mongo.repository';
import { postsCollection } from '../db';
import { PostsQueryBuilderResponseInterface } from '../interfaces/query-builder.interface';
import { CreatePostDto } from '../dto/posts/create-post.dto';
import { SortDirectionEnum } from '../enums';

export class PostsRepository
	extends MongoRepository<Omit<PostInterface, 'id'>>
	implements NoSqlRepositoryInterface<PostInterface>
{
	constructor() {
		super(postsCollection);
	}

	async create(data: CreatePostDto & { bloggerName: string }): Promise<PostsResponseType> {
		const createdAt = this.dateNow();
		const { bloggerName, title, shortDescription, content, bloggerId } = data;

		const { insertedId } = await this.collection.insertOne({ ...data, createdAt });

		return {
			id: insertedId.toString(),
			bloggerName,
			title,
			shortDescription,
			content,
			bloggerId,
			createdAt,
		};
	}

	async getAll(options: PostsQueryBuilderResponseInterface): Promise<PostsResponseType[]> {
		// const filter = id ? { bloggerId: id.toString() } : {};
		const sortDirection = options.sortDirection === SortDirectionEnum.Asc ? 1 : -1;
		const filter = options.bloggerId ? { bloggerId: options.bloggerId } : {};
		const postsWithDBID = await this.collection
			.find(filter)
			.sort({ [options.sortBy]: sortDirection })
			.skip(options.skip)
			.limit(options.pageSize)
			.toArray();
		return postsWithDBID.map(this.convertMongoEntityToResponse);
	}

	async getById(id: string): Promise<PostsResponseType | null> {
		const candidate = await this.collection.findOne({ _id: this.convertIdToObjectId(id) });
		if (candidate) {
			const { _id, ...post } = candidate;
			return {
				id: _id.toString(),
				...post,
			};
		}

		return null;
	}

	async removeById(id: string): Promise<boolean> {
		const { deletedCount } = await this.collection.deleteOne({ _id: this.convertIdToObjectId(id) });
		return !!deletedCount;
	}

	async update(id: string, data: Partial<Omit<PostInterface, 'id'>>): Promise<boolean> {
		const result = await this.collection.updateOne({ _id: this.convertIdToObjectId(id) }, { $set: { ...data } });
		return !!result.matchedCount;
	}

	async countCollectionByRegExp(key: keyof PostInterface, regexp: RegExp): Promise<number> {
		return this.collection.countDocuments({ [key]: { $regex: regexp } });
	}

	async countByBloggerId(id: string): Promise<number> {
		return this.collection.countDocuments({ bloggerId: id });
	}
}
