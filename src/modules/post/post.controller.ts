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
import { NextFunction } from 'express';
import { IOC_TYPES } from '../../_inversify/inversify.types';
import { AbstractPostService } from './types/post.service.types';
import { HttpStatusesEnum, SortDirectionEnum } from '../../enums';
import { ObjectId } from 'mongodb';
import { GetAllRepositoryResponse } from '../_base/types';
import { PostOutputInterface } from './entities';
import { EmptyResponse, GetAllEntities } from '../../_common/types';

@injectable()
export class PostController implements AbstractPostController {
	constructor(@inject(IOC_TYPES.PostService) private readonly postService: AbstractPostService) {}

	public async createPost(
		{ body: { content, title, shortDescription, blogId } }: CreatePostControllerRequest,
		response: CreatePostControllerResponse,
	): Promise<CreatePostControllerResponse> {
		const result = await this.postService.createPost({ content, title, shortDescription, blogId });
		return response.status(HttpStatusesEnum.CREATED).send(result);
	}

	public async deletePostById(
		{ params: { id } }: RemovePostControllerRequest,
		response: RemovePostControllerResponse,
	): Promise<EmptyResponse> {
		if (!this.checkId(id)) {
			return response.status(HttpStatusesEnum.NOT_FOUND).send();
		}
		const result = await this.postService.deletePostById(id);
		const status = result ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND;
		return response.status(status).send();
	}

	public async getAllPosts(
		{ query }: GetAllPostControllerRequest,
		response: GetAllPostControllerResponse,
	): Promise<GetAllPostControllerResponse> {
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
	}

	public async getPostById(
		{ params: { id } }: GetPostByIdControllerRequest,
		response: GetPostByIdControllerResponse,
	): Promise<GetPostByIdControllerResponse> {
		const postCandidate = await this.postService.getPostById(id);
		return postCandidate
			? response.status(HttpStatusesEnum.OK).send(postCandidate)
			: response.status(HttpStatusesEnum.NOT_FOUND).send();
	}

	public async updatePostById(
		{ body: { content, shortDescription, blogId, title }, params: { id } }: UpdatePostControllerRequest,
		response: UpdatePostControllerResponse,
	): Promise<UpdatePostControllerResponse> {
		const isUpdated: boolean = await this.postService.updatePostById(id, {
			content,
			shortDescription,
			blogId,
			title,
		});
		const status: number = isUpdated ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND;
		return response.status(status).send();
	}

	private checkId(id: string): boolean {
		return ObjectId.isValid(id);
	}
}
