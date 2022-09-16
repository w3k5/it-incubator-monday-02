import { AbstractBaseRepository } from '../../_base/abstractBaseRepository';
import { CreateCommentDatabaseDto, CreateCommentDto } from '../dto/createComment.dto';
import { CommentDatabaseModel } from '../entities';
import { ModelID } from '../../_base/types';

export abstract class AbstractCommentsRepository implements AbstractBaseRepository {
	abstract drop: () => Promise<void>;
	abstract create: (dto: CreateCommentDatabaseDto) => Promise<CommentDatabaseModel>;
	abstract update: (_id: ModelID, dto: CreateCommentDto) => Promise<boolean>;
	abstract delete: (_id: ModelID) => Promise<boolean>;
}
