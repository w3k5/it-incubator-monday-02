import { GetAllEntities, RequestWithQuery } from '@app/common-types';
import { GetAllBloggersQueryParams } from '../dto/bloggers/get-all-bloggers.type';
import { Response } from 'express';
import { BloggerInterface, PostInterface } from '../entities';
import { HttpStatusesEnum } from '../enums';
import { bloggerDomain } from './blogger.handlers';
import { PostsDomain } from '../domains/posts.domain';
import { GetAllPostsQueryParams } from '../dto/posts/get-all-posts.type';

export const postsDomain = new PostsDomain();

export class PostHandlers {
	/**
	 * Хэндлер возвращающий все посты с пагинацией
	 * @param request
	 */
	async getAllPosts(
		request: RequestWithQuery<GetAllPostsQueryParams>,
		response: Response<GetAllEntities<PostInterface>>,
	) {
		const { PageNumber, PageSize } = request.query;
		const result: GetAllEntities<PostInterface> = await postsDomain.getAllPosts(PageNumber, PageSize);
		return response.status(HttpStatusesEnum.OK).send(result);
	}
}
