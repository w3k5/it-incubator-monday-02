import { GetAllRepositoryResponse, ModelID } from '../../_base/types';
import { Nullable } from '../../../_common/types';
import { CommentDatabaseModel } from '../entities';
import { GetAllCommentsQueryParams } from './_comments.common.types';

export abstract class AbstractCommentsQueryRepository {
	abstract getCommentById: (_id: ModelID) => Promise<Nullable<CommentDatabaseModel>>;
	abstract getAllCommentsById: (
		_id: ModelID,
		params: Required<GetAllCommentsQueryParams>,
	) => Promise<GetAllRepositoryResponse<CommentDatabaseModel>>;
}
