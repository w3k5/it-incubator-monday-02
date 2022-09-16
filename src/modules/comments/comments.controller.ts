import 'reflect-metadata';
import {
	controller,
	httpGet,
	requestParam,
	requestBody,
	httpPost,
	request,
	response,
	httpPut,
	BaseHttpController,
	httpDelete,
} from 'inversify-express-utils';
import {inject} from 'inversify';
import {IOC_TYPES, MIDDLEWARES_TYPES, REPOSITORIES_TYPES, SERVICES_TYPES} from '../../_inversify/inversify.types';
import {AbstractTokenService} from '../../services/tokenService/interfaces';
import {MaxLength, MinLength, IsMongoId, ValidationError} from 'class-validator';
import {transformAndValidate} from 'class-transformer-validator';
import {AbstractErrorBoundaryService} from '../../_common/errors/errorBoundaryService.types';
import {ErrorMessageInterface} from '@app/interfaces';
import {Request, Response} from 'express';
import {AuthUserTokenInterface} from '../../_common/types';
import {AbstractCommentsQueryRepository} from './types/comments.repository.query.abstract';
import {HttpStatusesEnum} from '../../enums/http-statuses.enum';
import {CreateCommentDto} from './dto/createComment.dto';
import {ModelID} from '../_base/types';
import {AbstractCommentsService} from './types/comments.service.abstract';

class IdParam {
	@IsMongoId()
	id: string;
}

@controller('/comments')
class CommentsController extends BaseHttpController {
	constructor(
		@inject(REPOSITORIES_TYPES.CommentsQueryRepository)
		private readonly commentsQueryRepository: AbstractCommentsQueryRepository,
		@inject(SERVICES_TYPES.CommentsService) private readonly commentsService: AbstractCommentsService,
		@inject(IOC_TYPES.TokenService) private readonly tokenService: AbstractTokenService,
		@inject(IOC_TYPES.ErrorBoundaryService) private readonly errorBoundaryService: AbstractErrorBoundaryService,
	) {
		super();
	}

	/**
	 * GET COMMENT BY ID
	 * @param id
	 * @private
	 */
	@httpGet('/:id')
	private async getCommentById(@requestParam('id') id: ModelID, @response() response: Response) {
		try {
			await transformAndValidate(IdParam, {id});
			const commentCandidate = await this.commentsQueryRepository.getCommentById(id);
			if (!commentCandidate) {
				return response.status(HttpStatusesEnum.NOT_FOUND).send();
			}
			return {
				id: commentCandidate._id.toString(),
				content: commentCandidate.content,
				userId: commentCandidate.userId.toString(),
				userLogin: commentCandidate.userLogin,
				createdAt: commentCandidate.createdAt,
			};
		} catch (error) {
			if (Array.isArray(error)) {
				return response
					.status(HttpStatusesEnum.BAD_REQUEST)
					.send(this.errorBoundaryService.generateErrorFromClassValidator(error));
			}
			return error;
		}
		const token = this.tokenService.generate({message: 'ok1'});
		return {token, id, typeofid: typeof id};
	}

	/**
	 * UPDATE COMMENT
	 * @param body
	 * @private
	 */
	@httpPut('/:id', MIDDLEWARES_TYPES.AuthBearerMiddleware)
	private async updateComment(
		@requestParam('id') id: ModelID,
		@requestBody() body: CreateCommentDto,
		@response() response: Response,
		@request() request: Request,
	) {
		try {
			await transformAndValidate(IdParam, {id});
			const comment = await transformAndValidate(CreateCommentDto, body);

			// @ts-ignore
			const {id: userId, candidateLogin, email} = request.user as AuthUserTokenInterface;

			const commentCandidate = await this.commentsQueryRepository.getCommentById(id);

			if (!commentCandidate) {
				return response.status(HttpStatusesEnum.NOT_FOUND).send();
			}

			if (commentCandidate.userId.toString() !== userId) {
				return response.status(HttpStatusesEnum.FORBIDDEN).send();
			}

			const isUpdated = await this.commentsService.updateComment(id, comment);

			return response.status(HttpStatusesEnum.NO_CONTENT).send();
		} catch (error) {
			if (Array.isArray(error)) {
				return response
					.status(HttpStatusesEnum.BAD_REQUEST)
					.send(this.errorBoundaryService.generateErrorFromClassValidator(error));
			}
			return error;
		}
	}

	@httpDelete('/:id', MIDDLEWARES_TYPES.AuthBearerMiddleware)
	private async deleteCommentById(
		@request() request: Request,
		@response() response: Response,
		@requestParam('id') id: ModelID,
	) {
		try {
			await transformAndValidate(IdParam, {id});

			// @ts-ignore
			const {id: userId, candidateLogin, email} = request.user as AuthUserTokenInterface;

			const commentCandidate = await this.commentsQueryRepository.getCommentById(id);

			if (!commentCandidate) {
				return response.status(HttpStatusesEnum.NOT_FOUND).send();
			}

			if (commentCandidate.userId.toString() !== userId) {
				return response.status(HttpStatusesEnum.FORBIDDEN).send();
			}

			await this.commentsService.deleteComment(id);

			return response.status(HttpStatusesEnum.NO_CONTENT).send();
		} catch (error) {
			if (Array.isArray(error)) {
				return response
					.status(HttpStatusesEnum.BAD_REQUEST)
					.send(this.errorBoundaryService.generateErrorFromClassValidator(error));
			}
			return error;
		}
	}
}
