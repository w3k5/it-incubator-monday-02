import { inject, injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import { AbstractCommentsRepository } from './types/comments.repository.abstract';
import { CreateCommentDatabaseDto, CreateCommentDto } from './dto/createComment.dto';
import { CommentDatabaseModel } from './entities';
import { CommentModel } from './comments.schema';
import { IOC_TYPES } from '../../_inversify/inversify.types';
import { AbstractDateService } from '../../services/dateService/interfaces';
import { ModelID } from '../_base/types';

@injectable()
export class CommentsRepository implements AbstractCommentsRepository {
	constructor(@inject(IOC_TYPES.DateService) private readonly dateService: AbstractDateService) {}

	async create({ userId, userLogin, content, postId }: CreateCommentDatabaseDto): Promise<CommentDatabaseModel> {
		const convertedUserId = this.convertIdToMongoId(userId);
		const convertedPostId = this.convertIdToMongoId(postId);
		const createdAt = this.dateService.iso();

		return CommentModel.create({
			userId: convertedUserId,
			postId: convertedPostId,
			userLogin,
			createdAt,
			content,
		});
	}

	private convertIdToMongoId(id: ModelID) {
		return new ObjectId(id);
	}

	async update(commentId: ModelID, { content }: CreateCommentDto): Promise<boolean> {
		const updatedComment = await CommentModel.updateOne({ _id: commentId }, { content });
		return !!updatedComment.modifiedCount;
	}

	async delete(_id: ModelID): Promise<boolean> {
		const deleteResult = await CommentModel.deleteOne({ _id });
		return !!deleteResult.deletedCount;
	}

	async drop(): Promise<void> {
		await CommentModel.deleteMany({});
	}
}
