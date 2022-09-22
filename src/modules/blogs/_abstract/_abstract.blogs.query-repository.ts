import { ObjectId } from 'mongodb';
import { Nullable } from '../../../_common/types';
import { BlogDatabase } from '../entities';
import { GetAllRepositoryResponse } from '../../_base/types';
import { GetAllBlogsSearchParamsDto } from '../dto/getAllBlogsSearchParamsDto';

export abstract class AbstractBlogsQueryRepository {
	abstract getById: (_id: ObjectId) => Promise<Nullable<BlogDatabase>>;
	abstract getAll: (params: GetAllBlogsSearchParamsDto) => Promise<GetAllRepositoryResponse<BlogDatabase>>;
}
