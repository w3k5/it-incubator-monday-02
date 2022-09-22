import { inject, injectable } from 'inversify';
import {
	AbstractPostController,
	CreatePostControllerRequest,
	CreatePostControllerResponse,
	GetAllPostControllerRequest,
	GetAllPostControllerResponse,
	GetPostByIdControllerRequest,
	GetPostByIdControllerResponse,
	RemovePostControllerRequest,
	RemovePostControllerResponse,
	UpdatePostControllerRequest,
	UpdatePostControllerResponse,
} from './types/post.controller.types';
import { IOC_TYPES } from '../../_inversify/inversify.types';
import { AbstractPostService } from './types/post.service.types';
import { HttpStatusesEnum, SortDirectionEnum } from '../../enums';
import { ObjectId } from 'mongodb';
import { GetAllRepositoryResponse } from '../_base/types';
import { PostOutputInterface } from './entities';
import { EmptyResponse, GetAllEntities } from '../../_common/types';
import { AbstractErrorBoundaryService } from '../../_common/errors/errorBoundaryService.types';

@injectable()
export class PostController implements AbstractPostController {
	constructor(
		@inject(IOC_TYPES.PostService) private readonly postService: AbstractPostService,
		@inject(IOC_TYPES.ErrorBoundaryService) private readonly errorBoundary: AbstractErrorBoundaryService,
	) {}

	public async createPost(
		{ body: { title, shortDescription, blogId, content } }: CreatePostControllerRequest,
		response: CreatePostControllerResponse,
	): Promise<CreatePostControllerResponse> {
		try {
			const result = await this.postService.createPost({ content, title, shortDescription, blogId });
			return response.status(HttpStatusesEnum.CREATED).send(result);
		} catch (error) {
			return this.errorBoundary.sendError<CreatePostControllerResponse>(response, error);
		}
	}

	public async deletePostById(
		{ params: { id } }: RemovePostControllerRequest,
		response: RemovePostControllerResponse,
	): Promise<EmptyResponse> {
		try {
			if (!this.checkId(id)) {
				return response.status(HttpStatusesEnum.NOT_FOUND).send();
			}
			const result = await this.postService.deletePostById(id);
			const status = result ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND;
			return response.status(status).send();
		} catch (error) {
			return this.errorBoundary.sendError<EmptyResponse>(response, error);
		}
	}

	public async getAllPosts(
		{ query }: GetAllPostControllerRequest,
		response: GetAllPostControllerResponse,
	): Promise<GetAllPostControllerResponse> {
		try {
			const {
				pageNumber = 1,
				pageSize = 10,
				blogId = null,
				sortBy = 'createdAt',
				sortDirection = SortDirectionEnum.desc,
			} = query;
			const { documents, totalCount, pagesCount }: GetAllRepositoryResponse<PostOutputInterface> =
				await this.postService.getAllPosts({
					pageNumber,
					pageSize,
					blogId,
					sortBy,
					sortDirection,
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
			return this.errorBoundary.sendError<GetAllPostControllerResponse>(response, error);
		}
	}

	public async getPostById(
		{ params: { id } }: GetPostByIdControllerRequest,
		response: GetPostByIdControllerResponse,
	): Promise<GetPostByIdControllerResponse> {
		try {
			const postCandidate = await this.postService.getPostById(id);
			return postCandidate
				? response.status(HttpStatusesEnum.OK).send(postCandidate)
				: response.status(HttpStatusesEnum.NOT_FOUND).send();
		} catch (error) {
			return this.errorBoundary.sendError<GetPostByIdControllerResponse>(response, error);
		}
	}

	public async updatePostById(
		{ body: { content, shortDescription, blogId, title }, params: { id } }: UpdatePostControllerRequest,
		response: UpdatePostControllerResponse,
	): Promise<UpdatePostControllerResponse> {
		try {
			const isUpdated: boolean = await this.postService.updatePostById(id, {
				content,
				shortDescription,
				blogId,
				title,
			});
			const status: number = isUpdated ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND;
			return response.status(status).send();
		} catch (error) {
			return this.errorBoundary.sendError<UpdatePostControllerResponse>(response, error);
		}
	}

	private checkId(id: string): boolean {
		return ObjectId.isValid(id);
	}
}
