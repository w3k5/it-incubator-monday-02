import { CreateCommentDatabaseDto, CreateCommentDto } from '../dto/createComment.dto';
import { CommentDatabaseModel } from '../entities';
import { ModelID } from '../../_base/types';

export abstract class AbstractCommentsService {
	abstract createComment: (createCommentDto: CreateCommentDatabaseDto) => Promise<CommentDatabaseModel>;
	abstract updateComment: (commentId: ModelID, createCommentDto: CreateCommentDto) => Promise<boolean>;
	abstract deleteComment: (commentId: ModelID) => Promise<boolean>;
}
