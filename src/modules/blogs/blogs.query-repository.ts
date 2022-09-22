import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BlogDatabase } from './entities';
import { AbstractBlogsQueryRepository } from './_abstract/_abstract.blogs.query-repository';
import { GetAllBlogsSearchParamsDto } from './dto/getAllBlogsSearchParamsDto';
import { GetAllRepositoryResponse } from '../_base/types';
import { Nullable } from '../../_common/types';
import { LogicalBaseRepository } from '../_base/repository';
import { SortDirectionEnum } from '../../enums';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsQueryRepository extends LogicalBaseRepository implements AbstractBlogsQueryRepository {
	constructor(@InjectModel('blogs') private readonly BlogModel: Model<BlogDatabase>) {
		super();
	}

	async getAll({
		pageNumber,
		pageSize,
		searchNameTerm,
		sortDirection,
		sortBy,
	}: GetAllBlogsSearchParamsDto): Promise<GetAllRepositoryResponse<BlogDatabase>> {
		const skip = this.skipCount({ pageSize, pageNumber });
		const sortDirectionToNumber = sortDirection === SortDirectionEnum.asc ? 1 : -1;
		const totalCount = await this.BlogModel.countDocuments({
			$or: [{ name: { $regex: searchNameTerm ?? '', $options: 'i' } }],
		});

		if (!totalCount) {
			return { documents: [], totalCount: 0, pagesCount: 0 };
		}

		const documents = await this.BlogModel.find({
			$or: [{ name: { $regex: searchNameTerm ?? '', $options: 'i' } }],
		})
			.sort({ [sortBy]: sortDirectionToNumber })
			.limit(pageSize)
			.skip(skip);

		const pagesCount = this.countTotalPages(totalCount, pageSize);

		return { documents, totalCount, pagesCount };
	}

	async getById(_id: ObjectId): Promise<Nullable<BlogDatabase>> {
		const candidate = await this.BlogModel.findOne({ _id });
		return candidate || null;
	}
}
