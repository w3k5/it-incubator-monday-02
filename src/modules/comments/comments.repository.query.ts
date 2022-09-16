import { injectable } from 'inversify';
import { LogicalBaseRepository } from '../_base/repository';
import { AbstractCommentsQueryRepository } from './types/comments.repository.query.abstract';
import { CommentDatabaseModel } from './entities';
import { GetAllRepositoryResponse, ModelID } from '../_base/types';
import { GetAllCommentsQueryParams } from './types/_comments.common.types';
import { Nullable } from '../../_common/types';
import { SortDirectionEnum } from '../../enums';
import { CommentModel } from './comments.schema';

@injectable()
export class CommentsQueryRepository extends LogicalBaseRepository implements AbstractCommentsQueryRepository {
	async getAllCommentsById(
		_id: ModelID,
		{ sortBy, sortDirection, pageSize, pageNumber }: Required<GetAllCommentsQueryParams>,
	): Promise<GetAllRepositoryResponse<CommentDatabaseModel>> {
		const skip = this.skipCount({ pageSize, pageNumber });
		const sortDirectionToNumber = sortDirection === SortDirectionEnum.asc ? 1 : -1;
		const totalCount = await CommentModel.countDocuments({
			$or: [{ postId: _id }],
		});
		if (!totalCount) {
			return { documents: [], totalCount: 0, pagesCount: 0 };
		}

		const documents = await CommentModel.find({ $or: [{ postId: _id }] })
			.sort({ [sortBy]: sortDirectionToNumber })
			.limit(pageSize)
			.skip(skip);

		const pagesCount = this.countTotalPages(totalCount, pageSize);

		return { documents, totalCount, pagesCount };
	}

	async getCommentById(_id: ModelID): Promise<Nullable<CommentDatabaseModel>> {
		const candidate = await CommentModel.findOne({ _id });
		return candidate || null;
	}
}
