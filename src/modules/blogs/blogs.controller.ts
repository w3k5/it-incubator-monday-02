import { inject, injectable } from 'inversify';
import {
	AbstractBlogController,
	CreateBlogControllerRequest,
	CreateBlogControllerResponse,
	CreatePostByBlogIdControllerRequest,
	CreatePostByBlogIdControllerResponse,
	DeleteBlogByIdControllerRequest,
	DeleteBlogByIdControllerResponse,
	GetAllBlogControllerRequest,
	GetAllBlogControllerResponse,
	GetBlogByIdControllerRequest,
	GetBlogByIdControllerResponse,
	GetPostsByBlogIdControllerRequest,
	GetPostsByBlogIdControllerResponse,
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
import { AbstractPostService } from '../post/types/post.service.types';
import { PostOutputInterface } from '../post/entities';
import { postService } from '../../_inversify/inversify.config';

@injectable()
export class BlogsController implements AbstractBlogController {
	constructor(
		@inject(IOC_TYPES.BlogService) private readonly blogService: AbstractBlogService,
		// @inject(IOC_TYPES.PostService) private readonly _postService: AbstractPostService,
		@inject(IOC_TYPES.ErrorBoundaryService) private readonly errorBoundary: AbstractErrorBoundaryService,
	) {}

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
			// TODO: should be outside that layer (validator)
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

	// TODO: SQRS
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

	// TODO: SQRS
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

	// TODO: SQRS
	public async getPostsByBlogId(
		{ params: { blogId }, query }: GetPostsByBlogIdControllerRequest,
		response: GetPostsByBlogIdControllerResponse,
	): Promise<GetPostsByBlogIdControllerResponse> {
		try {
			const { pageNumber = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = SortDirectionEnum.desc } = query;

			const blogCandidate = await this.blogService.getBlogById(blogId);

			const { documents, totalCount, pagesCount }: GetAllRepositoryResponse<PostOutputInterface> =
				// TODO: SOMETHING WRONG WITH INJECT
				await postService.getAllPosts({
					pageNumber,
					pageSize,
					sortBy,
					sortDirection,
					blogId,
				});

			const result: GetAllEntities<PostOutputInterface> = {
				pageSize,
				page: pageNumber,
				totalCount,
				pagesCount,
				items: documents,
			};

			return response.status(HttpStatusesEnum.OK).send(result);
		} catch (error) {
			return this.errorBoundary.sendError<GetPostsByBlogIdControllerResponse>(response, error);
		}
	}

	async createPostByBlogId(
		{ params: { blogId }, body: { content, shortDescription, title } }: CreatePostByBlogIdControllerRequest,
		response: CreatePostByBlogIdControllerResponse,
	): Promise<CreatePostByBlogIdControllerResponse> {
		try {
			const blogCandidate = await this.blogService.getBlogById(blogId);
			const createdPost = await postService.createPost({
				blogId: blogCandidate.id,
				content,
				shortDescription,
				title,
			});
			return response.status(HttpStatusesEnum.CREATED).send(createdPost);
		} catch (error) {
			return this.errorBoundary.sendError<CreatePostByBlogIdControllerResponse>(response, error);
		}
	}

	private checkId(id: string): boolean {
		return ObjectId.isValid(id);
	}
}
