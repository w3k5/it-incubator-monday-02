import { Request, Response } from 'express';
import { BloggerInterface, BloggerResponseType } from '../entities';
import { bloggersRepository } from '../index';
import { HttpStatusesEnum } from '../enums';
import { queryBuilder } from '../services/query-builder';
import { getAllResponse } from '../interfaces/get-all-response.interface';
import { getAllResponseBuilder } from '../services/get-all-response-builder';

export class BloggerDomain {
	/**
	 * Returns all bloggers from database
	 * @param request
	 * @param response
	 */
	async getAll(request: Request, response: Response) {
		const searchParams = queryBuilder(request);
		const items = await bloggersRepository.getAll(searchParams);
		const total = await bloggersRepository.countCollectionByRegExp('name', searchParams.searchNameTerm);

		const builtResponse: getAllResponse<BloggerInterface> = getAllResponseBuilder<BloggerResponseType>(
			searchParams,
			items,
			total,
		);
		return response.status(HttpStatusesEnum.OK).send(builtResponse);
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
		const candidate = await bloggersRepository.getById(+id);

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
		const id = +request.params.id;
		const { name, youtubeUrl } = request.body;
		const isBloggerUpdated = await bloggersRepository.update(id, { name, youtubeUrl });
		const status = isBloggerUpdated ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND;
		return response.status(status).send();
	}

	/**
	 * Removes one blogger by ID
	 * @param request
	 * @param response
	 */
	async removeById(request: Request, response: Response) {
		const id = +request.params.id;
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
