import { EntityId, GetAllEntities, Nullable } from '@app/common-types';
import { bloggersRepository, postsRepository } from '../index';
import { countTotalPages, paginationBuilder } from '../helpers/pagination-builder';
import { PostInterface } from '../entities';
import { PostsQueryBuilderResponseInterface } from '../interfaces/query-builder.interface';
import { CreatePostDto, UpdatePostDto } from '../dto/posts/create-post.dto';
import { PostResponseInterface } from '../dto/posts/post-response.interface';
import { PaginationInterface, SortInterface } from '../interfaces/pagination.interface';

type GetAllPostsProps = Pick<PaginationInterface, 'pageNumber' | 'pageSize'> &
	SortInterface<PostInterface> & { bloggerId?: string };

export class PostsDomain {
	/**
	 * Роут для получения всех постов
	 * Должен ли этот метод обрабатывать блогера, если роут постов не должен ничего об этом знать?
	 * Требуется ли нам создать подобный метод в bloggerDomain для получения постов определенного пользователя?
	 * @param pageNumber
	 * @param pageSize
	 * @param bloggerId
	 */
	async getAllPosts({
		pageNumber,
		pageSize,
		bloggerId,
		sortBy,
		sortDirection,
	}: GetAllPostsProps): Promise<GetAllEntities<PostInterface>> {
		const { skip } = paginationBuilder({ pageNumber, pageSize });
		const repositorySearchParams: PostsQueryBuilderResponseInterface = {
			pageNumber,
			pageSize,
			skip,
			bloggerId: bloggerId || null,
			sortBy,
			sortDirection,
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

	// TODO: проверка должна быть в валидаторе
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
