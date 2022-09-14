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
import { HttpStatusesEnum, SortDirectionEnum } from '../../enums';
import { ObjectId } from 'mongodb';
import { GetAllRepositoryResponse } from '../_base/types';
import { BlogOutputInterface } from './entities';
import { EmptyResponse, GetAllEntities } from '../../_common/types';
import { AbstractErrorBoundaryService } from '../../_common/errors/errorBoundaryService.types';
import { AbstractBlogService } from './types/blogs.service.types';

@injectable()
export class BlogsController implements AbstractBlogController {
	async createBlog(
		{ body: { name, youtubeUrl } }: CreateBlogControllerRequest,
		response: CreateBlogControllerResponse,
	): Promise<CreateBlogControllerResponse> {
		try {
			const blog = await this.blogService.createBlog({ name, youtubeUrl });
			return response.status(HttpStatusesEnum.CREATED).send(blog);
		} catch (error) {
			return this.errorBoundary.sendError<CreateBlogControllerResponse>(response, error);
		}
	}

	async deleteBlogById(
		{ params }: DeleteBlogByIdControllerRequest,
		response: DeleteBlogByIdControllerResponse,
	): Promise<EmptyResponse> {
		try {
			const { id } = params;
			if (!this.checkId(id)) {
				return response.status(HttpStatusesEnum.NOT_FOUND).send();
			}
			const result = await this.blogService.deleteBlogById(id);
			const status = result ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND;
			return response.status(status).send();
		} catch (error) {
			return this.errorBoundary.sendError<EmptyResponse>(response, error);
		}
	}

	async getAllBlogs(
		{ query }: GetAllBlogControllerRequest,
		response: GetAllBlogControllerResponse,
	): Promise<GetAllBlogControllerResponse> {
		try {
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
		} catch (error) {
			return this.errorBoundary.sendError<GetAllBlogControllerResponse>(response, error);
		}
	}

	async getBlogById(
		{ params: { id } }: GetBlogByIdControllerRequest,
		response: GetBlogByIdControllerResponse,
	): Promise<GetBlogByIdControllerResponse> {
		try {
			const blog = await this.blogService.getBlogById(id);
			return blog
				? response.status(HttpStatusesEnum.OK).send(blog)
				: response.status(HttpStatusesEnum.NOT_FOUND).send();
		} catch (error) {
			return this.errorBoundary.sendError<GetBlogByIdControllerResponse>(response, error);
		}
	}

	async updateBlog(
		{ body: { name, youtubeUrl }, params: { id } }: UpdateBlogControllerRequest,
		response: UpdateBlogControllerResponse,
	): Promise<UpdateBlogControllerResponse> {
		try {
			const isUpdated: boolean = await this.blogService.updateBlogById(id, { youtubeUrl, name });
			const status: number = isUpdated ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND;
			return response.status(status).send();
		} catch (error) {
			return this.errorBoundary.sendError<UpdateBlogControllerResponse>(response, error);
		}
	}

	private checkId(id: string): boolean {
		return ObjectId.isValid(id);
	}

	constructor(
		@inject(IOC_TYPES.BlogService) private readonly blogService: AbstractBlogService,
		@inject(IOC_TYPES.ErrorBoundaryService) private readonly errorBoundary: AbstractErrorBoundaryService,
	) {}
}
