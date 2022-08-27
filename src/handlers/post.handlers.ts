import {
	EmptyResponse,
	EntityId,
	GetAllEntities,
	Nullable,
	RequestWithBody,
	RequestWithBodyAndParams,
	RequestWithParams,
	RequestWithQuery,
} from '@app/common-types';
import { NextFunction, Request, Response } from 'express';
import { PostInterface } from '../entities';
import { HttpStatusesEnum } from '../enums';
import { PostsDomain } from '../domains/posts.domain';
import { GetAllPostsQueryParams } from '../dto/posts/get-all-posts.type';
import { CreatePostDto, UpdatePostDto } from '../dto/posts/create-post.dto';
import { PostResponseInterface } from '../dto/posts/post-response.interface';

export const postsDomain = new PostsDomain();

export class PostHandlers {
	/**
	 * Хэндлер возвращающий все посты с пагинацией
	 * @param request
	 */
	async getAllPosts(
		request: RequestWithQuery<GetAllPostsQueryParams>,
		response: Response<GetAllEntities<PostInterface>>,
		next: NextFunction,
	) {
		try {
			const { PageNumber, PageSize } = request.query;
			const result: GetAllEntities<PostInterface> = await postsDomain.getAllPosts(PageNumber, PageSize);
			return response.status(HttpStatusesEnum.OK).send(result);
		} catch (error: any) {
			next({
				status: 500,
				message: 'Internal server error',
				error: error.message || 'something went wrong',
				route: 'posts',
				endpoint: 'get all',
			});
		}
	}

	async createPost(
		request: RequestWithBody<CreatePostDto>,
		response: Response<PostResponseInterface>,
		next: NextFunction,
	) {
		try {
			const { bloggerId, title, shortDescription, content } = request.body;
			const result = await postsDomain.create({ bloggerId, title, shortDescription, content });
			if (!result) {
				return response.status(HttpStatusesEnum.NOT_FOUND).send();
			}
			return response.status(HttpStatusesEnum.CREATED).send(result);
		} catch (error: any) {
			next({
				status: 500,
				message: 'Internal server error',
				error: error.message || 'something went wrong',
				route: 'posts',
				endpoint: 'create',
			});
		}
	}

	async getPostById(
		request: RequestWithParams<EntityId>,
		response: Response<PostResponseInterface>,
		next: NextFunction,
	) {
		try {
			const { id } = request.params;
			const post: Nullable<PostResponseInterface> = await postsDomain.getById(id);
			if (!post) {
				return response.status(HttpStatusesEnum.NOT_FOUND).send();
			}
			return response.status(HttpStatusesEnum.OK).send(post);
		} catch (error: any) {
			next({
				status: 500,
				message: 'Internal server error',
				error: error.message || 'something went wrong',
				route: 'posts',
				endpoint: 'get by id',
			});
		}
	}

	async updatePostById(request: RequestWithBodyAndParams<UpdatePostDto, EntityId>, response: EmptyResponse) {
		const { id } = request.params;
		const createPostDto = request.body;
		// TODO: blogger is not exists in request, wrote into request after validator checking
		//@ts-ignore
		const { name: bloggerName, id: bloggerId } = request.blogger;
		const result = await postsDomain.updateById(id, { ...createPostDto, bloggerId, bloggerName });
		if (result === null) {
			return response.status(HttpStatusesEnum.BAD_REQUEST).send();
		}
		return response.status(result ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND).send();
	}

	async dropCollection(request: Request, response: EmptyResponse) {
		await postsDomain.dropDatabase();
		return response.status(HttpStatusesEnum.NO_CONTENT).send();
	}

	async removePostById(request: RequestWithParams<EntityId>, response: EmptyResponse) {
		const { id } = request.params;
		const result = await postsDomain.removeById(id);
		if (!result) {
			return response.status(HttpStatusesEnum.NOT_FOUND).send();
		}
		return response.status(HttpStatusesEnum.NO_CONTENT).send();
	}
}
