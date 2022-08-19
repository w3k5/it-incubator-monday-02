import { Request, Response } from 'express';
import { bloggersRepository, postsRepository } from '../index';
import { HttpStatusesEnum } from '../enums';
import { PostInterface, PostsResponseType } from '../entities';
import { postsQueryBuilder } from '../services/query-builder';
import { getAllResponse } from '../interfaces/get-all-response.interface';
import { getAllResponseBuilder } from '../services/get-all-response-builder';
import { PostBloggerIdSearchParamType } from '../interfaces/search-param.interface';

export class PostsDomain {
	/**
	 * Returns all posts from database
	 * @param request
	 * @param response
	 */
	async getAll(request: Request, response: Response) {
		const searchParams: PostBloggerIdSearchParamType = postsQueryBuilder(request);
		const items = await postsRepository.getAll(searchParams);
		const total = searchParams.bloggerId
			? await postsRepository.countByBloggerId(searchParams.bloggerId)
			: await postsRepository.countAllDocuments();

		const builtResponse: getAllResponse<PostInterface> = getAllResponseBuilder<PostsResponseType>(
			searchParams,
			items,
			total,
		);

		return response.status(HttpStatusesEnum.OK).send(builtResponse);
	}

	/**
	 * Creates new post in database
	 * @param request
	 * @param response
	 */
	async create(request: Request, response: Response) {
		const bloggerId = request.body.bloggerId || request.params.id;
		const userCandidate = await bloggersRepository.getById(bloggerId);

		if (!userCandidate) {
			return response.status(HttpStatusesEnum.NOT_FOUND).send();
		}

		const newPost = await postsRepository.create({
			...request.body,
			bloggerName: userCandidate.name,
			bloggerId: bloggerId.toString(),
		});

		return response.status(HttpStatusesEnum.CREATED).send(newPost);
	}

	/**
	 * Returns one video from database
	 * @param request
	 * @param response
	 */
	async getById(request: Request, response: Response) {
		const id = request.params.id;
		const candidate = await postsRepository.getById(id);
		if (candidate) {
			return response.status(HttpStatusesEnum.OK).send(candidate);
		} else {
			return response.status(HttpStatusesEnum.NOT_FOUND).send();
		}
	}

	/**
	 * Returns one post by ID
	 * @param request
	 * @param response
	 */
	async updateById(request: Request, response: Response) {
		const { bloggerId: requestBloggerId } = request.body;
		const userCandidate = await bloggersRepository.getById(requestBloggerId);

		if (!userCandidate) {
			return response.status(HttpStatusesEnum.NOT_FOUND).send();
		}

		const { name: bloggerName, id: bloggerId } = userCandidate;

		const postId = request.params.id;

		const isPostUpdated = await postsRepository.update(postId, {
			...request.body,
			bloggerId,
			bloggerName,
		});
		return response.status(isPostUpdated ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND).send();
	}

	/**
	 * Removes one video by ID
	 * @param request
	 * @param response
	 */
	async removeById(request: Request, response: Response) {
		const id = request.params.id;
		const candidate = await postsRepository.getById(id);

		if (!candidate) {
			return response.status(HttpStatusesEnum.NOT_FOUND).send();
		}

		await postsRepository.removeById(id);

		return response.status(HttpStatusesEnum.NO_CONTENT).send();
	}

	/**
	 * Drops full database
	 * @param request
	 * @param response
	 */
	async dropDatabase(request: Request, response: Response) {
		await postsRepository.drop();
		return response.status(HttpStatusesEnum.NO_CONTENT).send();
	}
}
