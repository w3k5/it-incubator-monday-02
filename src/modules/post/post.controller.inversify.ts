import 'reflect-metadata';
import {
	controller,
	httpGet,
	requestParam,
	requestBody,
	httpPost,
	BaseHttpController,
	queryParam,
	response,
	request,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { IOC_TYPES, MIDDLEWARES_TYPES, REPOSITORIES_TYPES, SERVICES_TYPES } from '../../_inversify/inversify.types';
import { IsEnum, IsInt, IsMongoId, IsOptional, IsString } from 'class-validator';
import { transformAndValidate } from 'class-transformer-validator';
import { AbstractErrorBoundaryService } from '../../_common/errors/errorBoundaryService.types';
import { CreateCommentDto } from '../comments/dto/createComment.dto';
import { Request, Response } from 'express';
import { HttpStatusesEnum, SortDirectionEnum } from '../../enums';
import { AuthUserTokenInterface, GetAllEntities } from '../../_common/types';
import { AbstractPostRepositoryQueryTypes } from './types/post.repository.query.types';
import { AbstractCommentsService } from '../comments/types/comments.service.abstract';
import { CommentDatabaseModel, CommentOutputModel } from '../comments/entities';
import { GetAllCommentsQueryParams } from '../comments/types/_comments.common.types';
import { Transform } from 'class-transformer';
import { AbstractCommentsQueryRepository } from '../comments/types/comments.repository.query.abstract';

class IdParam {
	@IsMongoId()
	id: string;
}

class PaginationQueries implements GetAllCommentsQueryParams {
	@IsOptional()
	@Transform(({ value }) => +value)
	@IsInt()
	pageNumber: number;

	@IsOptional()
	@Transform(({ value }) => +value)
	@IsInt()
	pageSize: number;

	@IsOptional()
	@IsString()
	sortBy: keyof CommentOutputModel;

	@IsOptional()
	@IsEnum(SortDirectionEnum)
	sortDirection: SortDirectionEnum;
}

@controller('/posts')
class PostControllerInversify extends BaseHttpController {
	constructor(
		@inject(IOC_TYPES.ErrorBoundaryService) private readonly errorBoundaryService: AbstractErrorBoundaryService,
		@inject(REPOSITORIES_TYPES.PostQueryRepository)
		private readonly postQueryRepository: AbstractPostRepositoryQueryTypes,
		@inject(SERVICES_TYPES.CommentsService) private readonly commentsService: AbstractCommentsService,
		@inject(REPOSITORIES_TYPES.CommentsQueryRepository)
		private readonly commentsQueryRepository: AbstractCommentsQueryRepository,
	) {
		super();
	}

	@httpGet('/:id/comments')
	private async getPostsForSpecifiedPostById(
		@requestParam('id') id: string,
		@queryParam('pageNumber') pageNumber = 1,
		@queryParam('pageSize') pageSize = 10,
		@queryParam('sortBy') sortBy = 'createdAt',
		@queryParam('sortDirection') sortDirection = SortDirectionEnum.desc,
	) {
		try {
			const validated = await transformAndValidate(IdParam, { id });

			const validatedQueryParams = await transformAndValidate(PaginationQueries, {
				pageNumber,
				pageSize,
				sortBy,
				sortDirection,
			});

			const { documents, totalCount, pagesCount } = await this.commentsQueryRepository.getAllCommentsById(
				id,
				validatedQueryParams,
			);

			const result: GetAllEntities<CommentOutputModel> = {
				pageSize: validatedQueryParams.pageSize,
				page: validatedQueryParams.pageNumber,
				totalCount,
				pagesCount,
				items: documents.map(this.prepareComment),
			};

			return result;
		} catch (error) {
			if (Array.isArray(error)) {
				return this.errorBoundaryService.generateErrorFromClassValidator(error);
			}
			return error;
		}
	}

	@httpPost('/:id/comments', MIDDLEWARES_TYPES.AuthBearerMiddleware)
	private async createPostForSpecifiedPostById(
		@requestParam('id') postId: string,
		@requestBody() body: CreateCommentDto,
		@response() response: Response,
		@request() request: Request,
	) {
		try {
			await transformAndValidate(IdParam, { id: postId });
			const { content } = await transformAndValidate(CreateCommentDto, body);

			const postCandidate = await this.postQueryRepository.getById(postId);

			if (!postCandidate) {
				return response.status(HttpStatusesEnum.NOT_FOUND).send();
			}

			// @ts-ignore
			const { id: userId, candidateLogin: userLogin } = request.user as AuthUserTokenInterface;

			const newComment = await this.commentsService.createComment({
				postId,
				userId,
				userLogin,
				content,
			});

			return response.status(HttpStatusesEnum.CREATED).send({
				id: newComment._id.toString(),
				content: newComment.content,
				userId: newComment.userId.toString(),
				userLogin: newComment.userLogin,
				createdAt: newComment.createdAt,
			});
		} catch (error) {
			if (Array.isArray(error)) {
				return response
					.status(HttpStatusesEnum.BAD_REQUEST)
					.send(this.errorBoundaryService.generateErrorFromClassValidator(error));
			}
			return error;
		}
	}

	private prepareComment({ content, userId, userLogin, createdAt, _id }: CommentDatabaseModel): CommentOutputModel {
		return {
			content: content,
			userId: userId,
			userLogin: userLogin,
			createdAt: createdAt,
			id: _id.toString(),
		};
	}
}
