import { AbstractBaseRepository } from '../../_base/abstractBaseRepository';
import { CreateBlogRepositoryDto } from '../dto/createBlogRepositoryDto';
import { BlogDatabase } from '../entities';
import { GetAllRepositoryResponse, ModelID } from '../../_base/types';
import { UpdateBlogRepositoryDto } from '../dto/updateBlogRepositoryDto';
import { GetAllBlogQueryParams } from './_blog.common.types';
import { Nullable } from '../../../_common/types';

export abstract class AbstractBlogDatabaseRepository implements AbstractBaseRepository {
	abstract getById: (id: ModelID) => Promise<Nullable<BlogDatabase>>;
	abstract getAll: (params: GetAllBlogQueryParams) => Promise<GetAllRepositoryResponse<BlogDatabase>>;
	abstract create: (data: CreateBlogRepositoryDto) => Promise<BlogDatabase>;
	abstract updateById: (id: ModelID, data: UpdateBlogRepositoryDto) => Promise<boolean>;
	abstract delete: (_id: ModelID) => Promise<boolean>;
	abstract drop: () => Promise<void>;
}
