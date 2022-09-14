import { AbstractBaseRepository } from '../../_base/abstractBaseRepository';
import { GetAllRepositoryResponse, ModelID } from '../../_base/types';
import { PostDatabase } from '../entities';
import { CreatePostRepositoryDto } from '../dto/createPostRepositoryDto';
import { UpdatePostRepositoryDto } from '../dto/updatePostRepositoryDto';
import { GetAllPostQueryParams } from './_post.common.types';
import { Nullable } from '../../../_common/types';

export abstract class AbstractPostDatabaseRepository implements AbstractBaseRepository {
	abstract drop: () => Promise<void>;
	abstract getById: (_id: ModelID) => Promise<Nullable<PostDatabase>>;
	abstract getAll: (params: GetAllPostQueryParams) => Promise<GetAllRepositoryResponse<PostDatabase>>;
	abstract create: (data: CreatePostRepositoryDto) => Promise<PostDatabase>;
	abstract updateById: (_id: ModelID, data: UpdatePostRepositoryDto) => Promise<boolean>;
	abstract delete: (_id: ModelID) => Promise<boolean>;
}
