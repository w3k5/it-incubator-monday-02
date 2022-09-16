import { GetAllRepositoryResponse, ModelID } from '../../_base/types';
import { Nullable } from '../../../_common/types';
import { PostDatabase } from '../entities';
import { GetAllPostQueryParams } from './_post.common.types';

export abstract class AbstractPostRepositoryQueryTypes {
	abstract getById: (_id: ModelID) => Promise<Nullable<PostDatabase>>;
	abstract getAll: (params: GetAllPostQueryParams) => Promise<GetAllRepositoryResponse<PostDatabase>>;
}
