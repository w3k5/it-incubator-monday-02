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
		return bloggersRepository.create(createBloggerDto);
	}

	/**
	 * Returns one blogger from database
	 */
	async getBloggerById(id: string): Promise<BloggerInterface | null> {
		return bloggersRepository.getById(id);
	}

	/**
	 * Updates one blogger by ID
	 */
	async updateBloggerById(id: string, updateBloggerDto: UpdateBloggerDto): Promise<boolean> {
		return bloggersRepository.update(id, updateBloggerDto);
	}

	/**
	 * Removes one blogger by ID
	 */
	async removeBloggerById(id: string): Promise<boolean> {
		return bloggersRepository.removeById(id);
	}

	/**
	 * Drops full database
	 */
	async dropDatabase() {
		await bloggersRepository.drop();
	}
}
