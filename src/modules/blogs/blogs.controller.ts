import { inject, injectable } from 'inversify';
import {
	AbstractBlogController,
	CreateBlogControllerRequest,
	CreateBlogControllerResponse,
	DeleteBlogByIdControllerRequest,
	DeleteBlogByIdControllerResponse,
	GetAllBlogControllerRequest,
	GetAllBlogControllerResponse,
	GetBlogByIdControllerRequest,
	GetBlogByIdControllerResponse,
	UpdateBlogControllerRequest,
	UpdateBlogControllerResponse,
} from './types/blogs.controller.types';
import { IOC_TYPES } from '../../_inversify/inversify.types';
import { BlogsService } from './blogs.service';
import { HttpStatusesEnum, SortDirectionEnum } from '../../enums';
import { ObjectId } from 'mongodb';
import { GetAllRepositoryResponse } from '../_base/types';
import { BlogOutputInterface } from './entities';
import { EmptyResponse, GetAllEntities } from '../../_common/types';

@injectable()
export class BlogsController implements AbstractBlogController {
	async createBlog(
		{ body: { name, youtubeUrl } }: CreateBlogControllerRequest,
		response: CreateBlogControllerResponse,
	): Promise<CreateBlogControllerResponse> {
		const blog = await this.blogService.createBlog({ name, youtubeUrl });
		return response.status(HttpStatusesEnum.CREATED).send(blog);
	}

	async deleteBlogById(
		{ params }: DeleteBlogByIdControllerRequest,
		response: DeleteBlogByIdControllerResponse,
	): Promise<EmptyResponse> {
		const { id } = params;
		if (!this.checkId(id)) {
			return response.status(HttpStatusesEnum.NOT_FOUND).send();
		}
		const result = await this.blogService.deleteBlogById(id);
		const status = result ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND;
		return response.status(status).send();
	}

	async getAllBlogs(
		{ query }: GetAllBlogControllerRequest,
		response: GetAllBlogControllerResponse,
	): Promise<GetAllBlogControllerResponse> {
		const {
			pageNumber = 1,
			pageSize = 10,
			searchNameTerm = null,
			sortBy = 'createdAt',
			sortDirection = SortDirectionEnum.desc,
		} = query;

		const { documents, totalCount, pagesCount }: GetAllRepositoryResponse<BlogOutputInterface> =
			await this.blogService.getAllBlogs({
				pageNumber,
				pageSize,
				searchNameTerm,
				sortBy,
				sortDirection,
			});
		const result: GetAllEntities<BlogOutputInterface> = {
			pageSize,
			page: pageNumber,
			totalCount,
			pagesCount,
			items: documents,
		};
		return response.status(HttpStatusesEnum.OK).send(result);
	}

	async getBlogById(
		{ params: { id } }: GetBlogByIdControllerRequest,
		response: GetBlogByIdControllerResponse,
	): Promise<GetBlogByIdControllerResponse> {
		const blog = await this.blogService.getBlogById(id);
		return blog ? response.status(HttpStatusesEnum.OK).send(blog) : response.status(HttpStatusesEnum.NOT_FOUND).send();
	}

	async updateBlog(
		{ body: { name, youtubeUrl }, params: { id } }: UpdateBlogControllerRequest,
		response: UpdateBlogControllerResponse,
	): Promise<UpdateBlogControllerResponse> {
		const isUpdated: boolean = await this.blogService.updateBlogById(id, { youtubeUrl, name });
		const status: number = isUpdated ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND;
		return response.status(status).send();
	}

	private checkId(id: string): boolean {
		return ObjectId.isValid(id);
	}

	constructor(@inject(IOC_TYPES.BlogService) private readonly blogService: BlogsService) {}
}
