import { AbstractCommentsService } from './types/comments.service.abstract';
import { inject, injectable } from 'inversify';
import { CreateCommentDatabaseDto, CreateCommentDto } from './dto/createComment.dto';
import { CommentDatabaseModel } from './entities';
import { AbstractCommentsRepository } from './types/comments.repository.abstract';
import { REPOSITORIES_TYPES } from '../../_inversify/inversify.types';
import { ModelID } from '../_base/types';

@injectable()
export class CommentsService implements AbstractCommentsService {
	constructor(
		@inject(REPOSITORIES_TYPES.CommentsCommandRepository)
		private readonly commentsCommandRepository: AbstractCommentsRepository,
	) {}

	async createComment({ postId, content, userLogin, userId }: CreateCommentDatabaseDto): Promise<CommentDatabaseModel> {
		const newComment = await this.commentsCommandRepository.create({
			userLogin,
			content,
			userId,
			postId,
		});
		return newComment;
	}

	async updateComment(commentId: ModelID, createCommentDto: CreateCommentDto): Promise<boolean> {
		return this.commentsCommandRepository.update(commentId, createCommentDto);
	}

	async deleteComment(commentId: ModelID): Promise<boolean> {
		return this.commentsCommandRepository.delete(commentId);
	}
}
