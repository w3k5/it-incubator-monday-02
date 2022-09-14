import { LogicalBaseRepository } from '../_base/repository';
import { AbstractPostDatabaseRepository } from './types/post.repository.types';
import { inject, injectable } from 'inversify';
import { IOC_TYPES } from '../../_inversify/inversify.types';
import { DateServiceInterface } from '../../services/dateService/interfaces';
import { GetAllPostQueryParams } from './types/_post.common.types';
import { UpdatePostRepositoryDto } from './dto/updatePostRepositoryDto';
import { GetAllRepositoryResponse, ModelID } from '../_base/types';
import { CreatePostRepositoryDto } from './dto/createPostRepositoryDto';
import { PostDatabase } from './entities';
import { PostModel } from './post.schema';
import { SortDirectionEnum } from '../../enums';
import { Nullable } from '../../_common/types';

@injectable()
export class PostDatabaseRepository extends LogicalBaseRepository implements AbstractPostDatabaseRepository {
	constructor(@inject(IOC_TYPES.DateService) private readonly dateService: DateServiceInterface) {
		super();
	}

	public async create(data: CreatePostRepositoryDto): Promise<PostDatabase> {
		const createdAt = this.dateService.iso();
		return PostModel.create({ ...data, createdAt });
	}

	public async delete(_id: ModelID): Promise<boolean> {
		const result = await PostModel.deleteOne({ _id });
		return !!result.deletedCount;
	}

	public async drop(): Promise<void> {
		await PostModel.deleteMany({});
	}

	public async getAll({
		pageNumber = 1,
		pageSize = 10,
		sortBy = 'createdAt',
		sortDirection = SortDirectionEnum.desc,
		blogId = null,
	}: GetAllPostQueryParams): Promise<GetAllRepositoryResponse<PostDatabase>> {
		const skip = this.skipCount({ pageSize, pageNumber });
		const sortDirectionToNumber = sortDirection === SortDirectionEnum.asc ? 1 : -1;
		const totalCount = await PostModel.countDocuments({
			$or: [{ name: { $regex: blogId ?? '' } }],
		});

		if (!totalCount) {
			return { documents: [], totalCount: 0, pagesCount: 0 };
		}

		const documents = await PostModel.find({
			$or: [{ name: { $regex: blogId ?? '' } }],
		})
			.sort({ [sortBy]: sortDirectionToNumber })
			.limit(pageSize)
			.skip(skip);

		const pagesCount = this.countTotalPages(totalCount, pageSize);

		return { documents, totalCount, pagesCount };
	}

	public async getById(_id: ModelID): Promise<Nullable<PostDatabase>> {
		const candidate = await PostModel.findOne({ _id });
		return candidate || null;
	}

	public async updateById(_id: ModelID, data: UpdatePostRepositoryDto): Promise<boolean> {
		const updated = await PostModel.updateOne({ _id }, data);
		return !!updated.modifiedCount;
	}
}
