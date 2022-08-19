import { Request, Response } from 'express';
import { BloggerInterface } from '../entities/blogger.interface';
import { bloggersRepository } from '../index';
import { HttpStatusesEnum } from '../enums';

export class BloggerDomain {
	/**
	 * Returns all bloggers from database
	 * @param request
	 * @param response
	 */
	async get(request: Request, response: Response) {
		const bloggers: BloggerInterface[] = await bloggersRepository.getAll();
		return response.status(HttpStatusesEnum.OK).send(bloggers);
	}

	/**
	 * Creates new blogger in database
	 * @param request
	 * @param response
	 */
	async create(request: Request, response: Response) {
		const newBlogger = await bloggersRepository.create(request.body);
		return response.status(HttpStatusesEnum.CREATED).send(newBlogger);
	}

	/**
	 * Returns one blogger from database
	 * @param request
	 * @param response
	 */
	async getById({ params: { id } }: Request, response: Response) {
		const candidate = await bloggersRepository.getById(id);

		return candidate
			? response.status(HttpStatusesEnum.OK).send(candidate)
			: response.status(HttpStatusesEnum.NOT_FOUND).send();
	}

	/**
	 * Return one blogger by ID
	 * @param request
	 * @param response
	 */
	async updateById(request: Request, response: Response) {
		const id = request.params.id;
		const isBloggerUpdated = await bloggersRepository.update(id, request.body);
		const status = isBloggerUpdated ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND;
		return response.status(status).send();
	}

	/**
	 * Removes one blogger by ID
	 * @param request
	 * @param response
	 */
	async removeById(request: Request, response: Response) {
		const id = request.params.id;
		const candidate = await bloggersRepository.getById(id);

		if (!candidate) {
			return response.status(HttpStatusesEnum.NOT_FOUND).send();
		}

		await bloggersRepository.removeById(id);

		return response.status(HttpStatusesEnum.NO_CONTENT).send();
	}

	/**
	 * Drops full database
	 * @param request
	 * @param response
	 */
	async dropDatabase(request: Request, response: Response) {
		await bloggersRepository.drop();
		return response.status(HttpStatusesEnum.NO_CONTENT).send();
	}
}
