import { AbstractPostRepositoryQueryTypes } from './types/post.repository.query.types';
import { injectable } from 'inversify';
import { SortDirectionEnum } from '../../enums';
import { GetAllPostQueryParams } from './types/_post.common.types';
import { GetAllRepositoryResponse, ModelID } from '../_base/types';
import { PostDatabase } from './entities';
import { PostModel } from './post.schema';
import { Nullable } from '../../_common/types';
import { LogicalBaseRepository } from '../_base/repository';

@injectable()
export class PostRepositoryQuery extends LogicalBaseRepository implements AbstractPostRepositoryQueryTypes {
	constructor() {
		super();
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
			$or: [{ blogId: { $regex: blogId ?? '' } }],
		});

		if (!totalCount) {
			return { documents: [], totalCount: 0, pagesCount: 0 };
		}

		const documents = await PostModel.find({
			$or: [{ blogId: { $regex: blogId ?? '' } }],
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
}
