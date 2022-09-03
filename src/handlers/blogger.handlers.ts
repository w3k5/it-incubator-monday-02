import { Response } from 'express';
import {
	EmptyRequest,
	EmptyResponse,
	EntityId,
	GetAllEntities,
	PaginationParams,
	RequestWithBody,
	RequestWithBodyAndParams,
	RequestWithParams,
	RequestWithParamsAndQuery,
	RequestWithQuery,
} from '@app/common-types';
import { BloggerInterface, PostInterface } from '../entities';
import { BloggerDomain } from '../domains/bloggers.domain';
import { GetAllBloggersQueryParams } from '../dto/bloggers/get-all-bloggers.type';
import { HttpStatusesEnum } from '../enums';
import { CreateBloggerDto } from '../dto/bloggers/create-blogger.dto';
import { UpdateBloggerDto } from '../dto/bloggers/update-blogger.dto';
import { postsDomain } from './post.handlers';
import { CreatePostDto } from '../dto/posts/create-post.dto';

export const bloggerDomain = new BloggerDomain();

export class BloggerHandlers {
	// =================================================================================================================
	// GET REQUESTS
	// =================================================================================================================
	/**
	 * Просто хендлер который должен описывать получаемые данные в реквесте
	 * Обратиться к доменной зоне, запросить готовый вид и отправить результат
	 * @param request
	 * @param response
	 */
	async getAllBloggers(
		request: RequestWithQuery<GetAllBloggersQueryParams>,
		response: Response<GetAllEntities<BloggerInterface>>,
	) {
		const { pageNumber, pageSize, SearchNameTerm, sortBy, sortDirection } = request.query;

		const result: GetAllEntities<BloggerInterface> = await bloggerDomain.getAllBloggers(
			pageNumber,
			pageSize,
			sortBy,
			sortDirection,
			SearchNameTerm,
		);
		return response.status(HttpStatusesEnum.OK).send(result);
	}

	/**
	 * Хэндлер для получения блоггера по ID (number)
	 * @param request with id: string
	 * @param response<BloggerInterface>
	 */
	async getOneBloggerById(request: RequestWithParams<EntityId>, response: Response<BloggerInterface>) {
		const { id } = request.params;
		const blogger = await bloggerDomain.getBloggerById(id);
		return blogger
			? response.status(HttpStatusesEnum.OK).send(blogger)
			: response.status(HttpStatusesEnum.NOT_FOUND).send();
	}

	async getAllPostBySpecifiedBlogger(
		request: RequestWithParamsAndQuery<EntityId, PaginationParams>,
		response: Response<GetAllEntities<PostInterface>>,
	) {
		const {
			params: { id },
			query: { pageNumber, pageSize },
		} = request;
		const result = await postsDomain.getAllPosts({ pageNumber, pageSize, bloggerId: id });
		return response.status(HttpStatusesEnum.OK).send(result);
	}

	// =================================================================================================================
	// POST REQUESTS
	// =================================================================================================================
	/**
	 * Хэндлер для создания нового блоггера
	 * @param request
	 * @param response
	 */
	async createOneBlogger(request: RequestWithBody<CreateBloggerDto>, response: Response<BloggerInterface>) {
		const { youtubeUrl, name } = request.body;
		const blogger = await bloggerDomain.createBlogger({ name, youtubeUrl });
		return response.status(HttpStatusesEnum.CREATED).send(blogger);
	}

	/**
	 * Хэндлер для создания поста с помощью Blogger ID
	 * */
	async createPostByBloggerId(
		request: RequestWithBodyAndParams<Omit<CreatePostDto, 'bloggerId'>, EntityId>,
		response: Response,
	) {
		const { id } = request.params;
		const createPostDto = request.body;
		const result = await postsDomain.create({ ...createPostDto, bloggerId: id });
		return response.status(HttpStatusesEnum.CREATED).send(result);
	}

	// =================================================================================================================
	// PUT REQUESTS
	// =================================================================================================================
	/**
	 * Хэндлер для обновления существующего блоггера
	 * @param request
	 * @param response
	 */
	async updateOneBloggerById(request: RequestWithBodyAndParams<UpdateBloggerDto, EntityId>, response: EmptyResponse) {
		const {
			body: { name, youtubeUrl },
			params: { id },
		} = request;
		const isUpdated: boolean = await bloggerDomain.updateBloggerById(id, { name, youtubeUrl });
		const status: number = isUpdated ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND;
		return response.status(status).send();
	}

	// =================================================================================================================
	// DELETE REQUESTS
	// =================================================================================================================
	/**
	 * Удаляет блоггера по ID
	 * @param request
	 * @param response
	 */
	async removeOneBloggerById(request: RequestWithParams<EntityId>, response: EmptyResponse) {
		const { id } = request.params;
		const isDeleted = await bloggerDomain.removeBloggerById(id);
		const status: number = isDeleted ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND;
		return response.status(status).send();
	}

	/**
	 * Дропает всю коллекцию
	 */
	async dropBloggerCollection(_: EmptyRequest, response: EmptyResponse) {
		await bloggerDomain.dropDatabase();
		return response.status(HttpStatusesEnum.OK).send();
	}
}
