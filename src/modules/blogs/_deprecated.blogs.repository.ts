import { AbstractBlogDatabaseRepository } from './types/blogs.repository.types';
import { inject, injectable } from 'inversify';
import { LogicalBaseRepository } from '../_base/repository';
import { IOC_TYPES } from '../../_inversify/inversify.types';
import { AbstractDateService } from '../../services/dateService/interfaces';
import { _deprecatedCreateBlogRepositoryDto } from './dto/_deprecated.createBlogRepositoryDto';
import { BlogDatabase } from './entities';
import { _deprecatedUpdateBlogRepositoryDto } from './dto/_deprecated.updateBlogRepositoryDto';
import { GetAllBlogQueryParams } from './types/_blog.common.types';
import { GetAllRepositoryResponse, ModelID } from '../_base/types';
import { BlogModel } from './blogs.schema';
import { SortDirectionEnum } from '../../enums';
import { Nullable } from '../../_common/types';

@injectable()
export class _deprecatedBlogsDatabaseRepository
	extends LogicalBaseRepository
	implements AbstractBlogDatabaseRepository
{
	constructor(@inject(IOC_TYPES.DateService) private readonly dateService: AbstractDateService) {
		super();
	}

	/**
	 * @deprecated
	 * @param name
	 * @param youtubeUrl
	 */
	create({ name, youtubeUrl }: _deprecatedCreateBlogRepositoryDto): Promise<BlogDatabase> {
		const createdAt = this.dateService.iso();
		return BlogModel.create({ name, youtubeUrl, createdAt });
	}

	async delete(_id: ModelID): Promise<boolean> {
		const result = await BlogModel.deleteOne({ _id });
		return !!result.deletedCount;
	}

	async drop(): Promise<void> {
		await BlogModel.deleteMany({});
	}

	async getAll({
		pageNumber = 1,
		pageSize = 10,
		searchNameTerm = null,
		sortBy = 'createdAt',
		sortDirection = SortDirectionEnum.desc,
	}: GetAllBlogQueryParams): Promise<GetAllRepositoryResponse<BlogDatabase>> {
		const skip = this.skipCount({ pageSize, pageNumber });
		const sortDirectionToNumber = sortDirection === SortDirectionEnum.asc ? 1 : -1;
		const totalCount = await BlogModel.countDocuments({
			$or: [{ name: { $regex: searchNameTerm ?? '', $options: 'i' } }],
		});

		if (!totalCount) {
			return { documents: [], totalCount: 0, pagesCount: 0 };
		}

		const documents = await BlogModel.find({
			$or: [{ name: { $regex: searchNameTerm ?? '', $options: 'i' } }],
		})
			.sort({ [sortBy]: sortDirectionToNumber })
			.limit(pageSize)
			.skip(skip);

		const pagesCount = this.countTotalPages(totalCount, pageSize);

		return { documents, totalCount, pagesCount };
	}

	async getById(_id: ModelID): Promise<Nullable<BlogDatabase>> {
		const candidate = await BlogModel.findOne({ _id });
		return candidate || null;
	}

	async updateById(_id: ModelID, { name, youtubeUrl }: _deprecatedUpdateBlogRepositoryDto): Promise<boolean> {
		const updated = await BlogModel.updateOne({ _id }, { name, youtubeUrl });
		return !!updated.modifiedCount;
	}
}
