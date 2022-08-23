import { Request, Response } from 'express';
import { BloggerInterface } from '../entities';
import { bloggersRepository } from '../index';
import { HttpStatusesEnum } from '../enums';
import { countTotalPages, paginationBuilder } from '../helpers/pagination-builder';
import { GetAllEntities } from '../dto/common/common.types';
import { CreateBloggerDto } from '../dto/bloggers/create-blogger.dto';
import { UpdateBloggerDto } from '../dto/bloggers/update-blogger.dto';

export class BloggerDomain {
	/**
	 * Returns all bloggers from database
	 */
	async getAllBloggers(
		pageNumber: number,
		pageSize: number,
		searchNameTerm?: string,
	): Promise<GetAllEntities<BloggerInterface>> {
		const { skip } = paginationBuilder({ pageNumber, pageSize });
		const filter = new RegExp(searchNameTerm || '.*');
		const result = await bloggersRepository.getAll({ pageNumber, pageSize, skip, searchNameTerm: filter });
		const total = await bloggersRepository.countCollectionByRegExp('name', filter);
		const pagesCount = countTotalPages(total, pageSize);
		return {
			pagesCount,
			page: pageNumber,
			pageSize,
			totalCount: total,
			items: result,
		};
	}

	/**
	 * Creates new blogger in database
	 */
	async createBlogger(createBloggerDto: CreateBloggerDto) {
		return await bloggersRepository.create(createBloggerDto);
	}

	/**
	 * Returns one blogger from database
	 */
	async getBloggerById(id: number): Promise<BloggerInterface | null> {
		const candidate = await bloggersRepository.getById(id);
		return candidate;
	}

	/**
	 * Updates one blogger by ID
	 */
	async updateBloggerById(id: number, updateBloggerDto: UpdateBloggerDto): Promise<boolean> {
		const isBloggerUpdated: boolean = await bloggersRepository.update(id, updateBloggerDto);
		return isBloggerUpdated;
	}

	/**
	 * Removes one blogger by ID
	 */
	async removeBloggerById(id: number): Promise<boolean> {
		const candidate = await bloggersRepository.getById(id);

		if (!candidate) {
			return false;
		}

		await bloggersRepository.removeById(id);
		return true;
	}

	/**
	 * Drops full database
	 * @param request
	 * @param response
	 * @deprecated
	 */
	async dropDatabase(request: Request, response: Response) {
		await bloggersRepository.drop();
		return response.status(HttpStatusesEnum.NO_CONTENT).send();
	}
}
