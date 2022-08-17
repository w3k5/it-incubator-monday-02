import { Request, Response } from 'express';
import { HttpStatusesEnum } from '../../enums';
import { bloggersRepository, postsRepository } from '../../index';

/**
 * Returns all posts from database
 * @param request
 * @param response
 */
export const getAllPosts = async (request: Request, response: Response) => {
	const videos = await postsRepository.getAll();
	return response.status(HttpStatusesEnum.OK).send(videos);
};

/**
 * Creates new post in database
 * @param request
 * @param response
 */
export const createPost = async (request: Request, response: Response) => {
	const { bloggerId } = request.body;
	const userCandidate = await bloggersRepository.getById(bloggerId);

	if (!userCandidate) {
		return response.status(HttpStatusesEnum.NOT_FOUND).send();
	}

	const newPost = await postsRepository.create({
		...request.body,
		bloggerName: userCandidate.name,
	});
	return response.status(HttpStatusesEnum.CREATED).send(newPost);
};

/**
 * Returns one video from database
 * @param request
 * @param response
 */
export const getPostById = async (request: Request, response: Response) => {
	const id = +request.params.id;
	const candidate = await postsRepository.getById(id);
	if (candidate) {
		return response.status(HttpStatusesEnum.OK).send(candidate);
	} else {
		return response.status(HttpStatusesEnum.NOT_FOUND).send();
	}
};

/**
 * Returns one post by ID
 * @param request
 * @param response
 */
export const updatePostById = async (request: Request, response: Response) => {
	const { bloggerId: requestBloggerId } = request.body;
	const userCandidate = await bloggersRepository.getById(requestBloggerId);
	console.log(requestBloggerId);

	if (!userCandidate) {
		return response.status(HttpStatusesEnum.NOT_FOUND).send();
	}

	const { name: bloggerName, id: bloggerId } = userCandidate;
	const postId = +request.params.id;

	const isPostUpdated = await postsRepository.update(postId, {
		...request.body,
		bloggerId,
		bloggerName,
	});
	return response
		.status(
			isPostUpdated ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND,
		)
		.send();
};

/**
 * Removes one video by ID
 * @param request
 * @param response
 */
export const removePostById = async (request: Request, response: Response) => {
	const id = +request.params.id;
	const candidate = await postsRepository.getById(id);

	if (!candidate) {
		return response.status(HttpStatusesEnum.NOT_FOUND).send();
	}

	await postsRepository.removeById(id);

	return response.status(HttpStatusesEnum.NO_CONTENT).send();
};

/**
 * Drops full database
 * @param request
 * @param response
 */
export const dropDatabase = async (request: Request, response: Response) => {
	await postsRepository.drop();
	return response.status(HttpStatusesEnum.NO_CONTENT).send();
};
