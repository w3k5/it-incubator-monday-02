import { Request, Response } from 'express';
import { GetAllEntities } from '@app/common-types';
import { bloggersRepository, postsRepository } from '../index';
import { HttpStatusesEnum } from '../enums';
import { countTotalPages, paginationBuilder } from '../helpers/pagination-builder';
import { PostInterface } from '../entities';
import { PostsQueryBuilderResponseInterface } from '../interfaces/query-builder.interface';

export class PostsDomain {
	/**
	 * Роут для получения всех постов
	 * Должен ли этот метод обрабатывать блогера, если роут постов не должен ничего об этом знать?
	 * Требуется ли нам создать подобный метод в bloggerDomain для получения постов определенного пользователя?
	 * @param pageNumber
	 * @param pageSize
	 * @param bloggerId
	 */
	async getAllPosts(pageNumber: number, pageSize: number, bloggerId?: number): Promise<GetAllEntities<PostInterface>> {
		const { skip } = paginationBuilder({ pageNumber, pageSize });
		const repositorySearchParams: PostsQueryBuilderResponseInterface = {
			pageNumber,
			pageSize,
			skip,
			bloggerId: bloggerId || null,
		};
		const result = await postsRepository.getAll(repositorySearchParams);
		const total: number = bloggerId
			? await postsRepository.countByBloggerId(bloggerId)
			: await postsRepository.countAllDocuments();
		const pagesCount: number = countTotalPages(total, pageSize);
		return {
			pagesCount,
			page: pageNumber,
			pageSize,
			totalCount: total,
			items: result,
		};
	}

	/**
	 * Creates new post in database
	 * @param request
	 * @param response
	 */
	async create(request: Request, response: Response) {
		const bloggerId = request.body.bloggerId || request.params.id;
		// TODO: Service
		const userCandidate = await bloggersRepository.getById(bloggerId);

		if (!userCandidate) {
			return response.status(HttpStatusesEnum.NOT_FOUND).send();
		}

		const newPost = await postsRepository.create({
			...request.body,
			bloggerName: userCandidate.name,
			// bloggerId: bloggerId.toString(),
			bloggerId: bloggerId,
		});

		return response.status(HttpStatusesEnum.CREATED).send(newPost);
	}

	/**
	 * Returns one post from database
	 * @param request
	 * @param response
	 */
	async getById(request: Request, response: Response) {
		const id = request.params.id;
		const candidate = await postsRepository.getById(+id);
		if (candidate) {
			return response.status(HttpStatusesEnum.OK).send(candidate);
		} else {
			return response.status(HttpStatusesEnum.NOT_FOUND).send();
		}
	}

	/**
	 * Updates one post by ID
	 * @param request
	 * @param response
	 */
	async updateById(request: Request, response: Response) {
		const { bloggerId: requestBloggerId } = request.body;
		const userCandidate = await bloggersRepository.getById(requestBloggerId);

		if (!userCandidate) {
			return response.status(HttpStatusesEnum.BAD_REQUEST).send();
		}

		const { name: bloggerName, id: bloggerId } = userCandidate;

		const postId = request.params.id;
		console.log(request.body);
		const isPostUpdated = await postsRepository.update(+postId, {
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
		const id = +request.params.id;
		const candidate = await postsRepository.getById(id);

		if (!candidate) {
			return response.status(HttpStatusesEnum.NOT_FOUND).send();
		}

		await postsRepository.removeById(+id);

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
