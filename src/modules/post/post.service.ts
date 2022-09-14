import { inject, injectable } from 'inversify';
import { AbstractPostService } from './types/post.service.types';
import { IOC_TYPES } from '../../_inversify/inversify.types';
import { AbstractPostDatabaseRepository } from './types/post.repository.types';
import { GetAllPostQueryParams } from './types/_post.common.types';
import { PostDatabase, PostInputInterface, PostInputUpdateInterface, PostOutputInterface } from './entities';
import { GetAllRepositoryResponse, ModelID } from '../_base/types';
import { AbstractBlogDatabaseRepository } from '../blogs/types/blogs.repository.types';
import { NotFoundError } from '../../_common/errors';

@injectable()
export class PostService implements AbstractPostService {
	constructor(
		@inject(IOC_TYPES.PostDatabaseRepository) private readonly postDatabaseRepository: AbstractPostDatabaseRepository,
		@inject(IOC_TYPES.BlogDatabaseRepository) private readonly blogDatabaseRepository: AbstractBlogDatabaseRepository,
	) {}

	public async createPost({
		blogId,
		content,
		shortDescription,
		title,
	}: PostInputInterface): Promise<PostOutputInterface> {
		const blogCandidate = await this.blogDatabaseRepository.getById(blogId);
		if (!blogCandidate) {
			throw new NotFoundError();
		}

		const newPost = await this.postDatabaseRepository.create({
			blogId,
			content,
			shortDescription,
			title,
			blogName: blogCandidate.name,
		});

		return this.preparePostModel(newPost);
	}

	public async deletePostById(id: ModelID): Promise<boolean> {
		return await this.postDatabaseRepository.delete(id);
	}

	public async drop(): Promise<void> {
		await this.postDatabaseRepository.drop();
	}

	public async getAllPosts(params: GetAllPostQueryParams): Promise<GetAllRepositoryResponse<PostOutputInterface>> {
		const { documents, totalCount, pagesCount } = await this.postDatabaseRepository.getAll(params);
		return { documents: documents.map(this.preparePostModel), totalCount, pagesCount };
	}

	public async getPostById(id: ModelID): Promise<PostOutputInterface> {
		const candidate = await this.postDatabaseRepository.getById(id);
		if (!candidate) {
			throw new NotFoundError();
		}
		return this.preparePostModel(candidate);
	}

	public async updatePostById(
		id: ModelID,
		{ blogId, content, shortDescription, title }: PostInputUpdateInterface,
	): Promise<boolean> {
		const { blogName } = await this.getPostById(blogId);
		return await this.postDatabaseRepository.updateById(id, {
			title,
			blogId,
			content,
			shortDescription,
			blogName,
		});
	}

	private preparePostModel({
		blogName,
		blogId,
		title,
		shortDescription,
		content,
		createdAt,
		_id,
	}: PostDatabase): PostOutputInterface {
		return {
			blogName,
			blogId,
			title,
			shortDescription,
			content,
			createdAt,
			id: _id.toString(),
		};
	}
}
