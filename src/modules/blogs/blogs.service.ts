import { AbstractBlogService } from './types/blogs.service.types';
import { inject, injectable } from 'inversify';
import { IOC_TYPES } from '../../_inversify/inversify.types';
import { AbstractBlogDatabaseRepository } from './types/blogs.repository.types';
import { UpdateBlogRepositoryDto } from './dto/updateBlogRepositoryDto';
import { BlogDatabase, BlogInputInterface, BlogOutputInterface } from './entities';
import { GetAllBlogQueryParams } from './types/_blog.common.types';
import { GetAllRepositoryResponse, ModelID } from '../_base/types';
import { NotFoundError } from '../../_common/errors';

@injectable()
export class BlogsService implements AbstractBlogService {
	constructor(
		@inject(IOC_TYPES.BlogDatabaseRepository) private readonly blogDatabaseRepository: AbstractBlogDatabaseRepository,
	) {}

	public async createBlog({ name, youtubeUrl }: BlogInputInterface): Promise<BlogOutputInterface> {
		const newBlog = await this.blogDatabaseRepository.create({ name, youtubeUrl });
		return this.prepareBlogModel(newBlog);
	}

	public async deleteBlogById(id: ModelID): Promise<boolean> {
		return await this.blogDatabaseRepository.delete(id);
	}

	public async getAllBlogs(params: GetAllBlogQueryParams): Promise<GetAllRepositoryResponse<BlogOutputInterface>> {
		const { documents, totalCount, pagesCount } = await this.blogDatabaseRepository.getAll(params);
		return { documents: documents.map(this.prepareBlogModel), totalCount, pagesCount };
	}

	public async getBlogById(id: ModelID): Promise<BlogOutputInterface> {
		const candidate = await this.blogDatabaseRepository.getById(id);
		if (!candidate) {
			throw new NotFoundError(`Blog with id ${id} Not Found`);
		}
		return this.prepareBlogModel(candidate);
	}

	public async updateBlogById(id: ModelID, data: UpdateBlogRepositoryDto): Promise<boolean> {
		return await this.blogDatabaseRepository.updateById(id, data);
	}

	public async drop(): Promise<void> {
		await this.blogDatabaseRepository.drop();
	}

	private prepareBlogModel({ name, youtubeUrl, createdAt, _id }: BlogDatabase): BlogOutputInterface {
		return {
			name,
			youtubeUrl,
			createdAt,
			id: _id.toString(),
		};
	}
}
