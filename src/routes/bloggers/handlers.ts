import { Request, Response } from 'express';
import { BloggerInterface } from '@app/interfaces';
import { HttpStatusesEnum } from '../../enums';
import { Repository } from '../../repositories/repository';
import { bloggersRepository } from '../../index';

/**
 * Returns all bloggers from database
 * @param request
 * @param response
 */
export const get = async (request: Request, response: Response) => {
	const videos = await bloggersRepository.getAll();
	return response.status(HttpStatusesEnum.OK).send(videos);
};

/**
 * Creates new blogger in database
 * @param request
 * @param response
 */
export const create = async (request: Request, response: Response) => {
	const newVideo = await bloggersRepository.create(request.body);
	return response.status(HttpStatusesEnum.CREATED).send(newVideo);
};

/**
 * Returns one blogger from database
 * @param request
 * @param response
 */
export const getById = async (request: Request, response: Response) => {
	const id = +request.params.id;
	const candidate = await bloggersRepository.getById(id);
	if (candidate) {
		return response.status(HttpStatusesEnum.OK).send(candidate);
	} else {
		return response.status(HttpStatusesEnum.NOT_FOUND).send();
	}
};

/**
 * Return one blogger by ID
 * @param request
 * @param response
 */
export const updateById = async (request: Request, response: Response) => {
	const id = +request.params.id;
	const isBloggerUpdated = await bloggersRepository.update(id, request.body);
	const status = isBloggerUpdated
		? HttpStatusesEnum.NO_CONTENT
		: HttpStatusesEnum.NOT_FOUND;
	return response.status(status).send();
};

/**
 * Removes one blogger by ID
 * @param request
 * @param response
 */
export const removeById = async (request: Request, response: Response) => {
	const id = +request.params.id;
	const candidate = await bloggersRepository.getById(id);

	if (!candidate) {
		return response.status(HttpStatusesEnum.NOT_FOUND).send();
	}

	await bloggersRepository.removeById(id);

	return response.status(HttpStatusesEnum.NO_CONTENT).send();
};

/**
 * Drops full database
 * @param request
 * @param response
 */
export const dropDatabase = async (request: Request, response: Response) => {
	await bloggersRepository.drop();
	return response.status(HttpStatusesEnum.NO_CONTENT).send();
};
