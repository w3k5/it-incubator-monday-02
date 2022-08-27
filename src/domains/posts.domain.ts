import { Request, Response } from 'express';
import { GetAllEntities, Nullable } from '@app/common-types';
import { bloggersRepository, postsRepository } from '../index';
import { HttpStatusesEnum } from '../enums';
import { countTotalPages, paginationBuilder } from '../helpers/pagination-builder';
import { PostInterface } from '../entities';
import { PostsQueryBuilderResponseInterface } from '../interfaces/query-builder.interface';
import { CreatePostDto, UpdatePostDto } from '../dto/posts/create-post.dto';
import { PostResponseInterface } from '../dto/posts/post-response.interface';

export class PostsDomain {
	/**
	 * Роут для получения всех постов
	 * Должен ли этот метод обрабатывать блогера, если роут постов не должен ничего об этом знать?
	 * Требуется ли нам создать подобный метод в bloggerDomain для получения постов определенного пользователя?
	 * @param pageNumber
	 * @param pageSize
	 * @param bloggerId
	 */
	async getAllPosts(pageNumber: number, pageSize: number, bloggerId?: string): Promise<GetAllEntities<PostInterface>> {
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
	 */
	async create(createPostDto: CreatePostDto): Promise<Nullable<PostInterface>> {
		const { bloggerId } = createPostDto;
		const bloggerCandidate = await bloggersRepository.getById(bloggerId);

		if (!bloggerCandidate) {
			return null;
		}

		const newPost = await postsRepository.create({
			...createPostDto,
			bloggerId: bloggerId,
			bloggerName: bloggerCandidate.name,
		});

		return newPost;
	}

	/**
	 * Returns one post from database
	 */
	async getById(id: string): Promise<Nullable<PostResponseInterface>> {
		return postsRepository.getById(id);
	}

	/**
	 * Updates one post by ID
	 */
	async updateById(id: string, updatePostDto: UpdatePostDto): Promise<boolean> {
		const { bloggerId, title, shortDescription, content, bloggerName } = updatePostDto;
		return postsRepository.update(id, {
			title,
			content,
			shortDescription,
			bloggerId,
			bloggerName,
		});
	}

	/**
	 * Removes one video by ID
	 */
	async removeById(id: string) {
		// const id = request.params.id;
		// const candidate = await postsRepository.getById(id);
		// if (!candidate) {
		// 	return response.status(HttpStatusesEnum.NOT_FOUND).send();
		// }

		return await postsRepository.removeById(id);

		// return response.status(HttpStatusesEnum.NO_CONTENT).send();
	}

	/**
	 * Drops full database
	 */
	async dropDatabase() {
		await postsRepository.drop();
	}
}
