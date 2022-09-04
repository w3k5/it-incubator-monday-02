import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { GetAllRepositoryResponse, UserDatabaseRepositoryType } from './repository.interface';
import { CreateUserRepositoryDto } from '@models/user/types/dto/createUserRepositoryDto';
import { UserDatabase } from '@models/user/types/entities';
import { UserModel } from '../schema';
import { IOC_TYPES } from '../../../inversify/inversify.types';
import { DateServiceInterface } from '../../../services/dateService/interfaces';
import { GetAllUsersQueryParams } from '@models/user/controllers/controller.types';
import { SortDirectionEnum } from '../../../enums';
import { BaseRepository } from '../../_base/repository';

@injectable()
export class UserDatabaseRepository extends BaseRepository implements UserDatabaseRepositoryType {
	constructor(@inject(IOC_TYPES.DateService) private readonly dateService: DateServiceInterface) {
		super();
	}

	async create({ login, email, password }: CreateUserRepositoryDto): Promise<UserDatabase> {
		const createdAt = this.dateService.iso();
		return UserModel.create({ login, email, password, createdAt });
	}

	async delete(_id: string): Promise<boolean> {
		const result = await UserModel.deleteOne({ _id });
		return !!result.deletedCount;
	}

	async getAll({
		pageNumber = 1,
		pageSize = 10,
		searchEmailTerm = null,
		searchLoginTerm = null,
		sortBy = 'createdAt',
		sortDirection = SortDirectionEnum.Desc,
	}: GetAllUsersQueryParams): Promise<GetAllRepositoryResponse> {
		const skip = this.skipCount({ pageSize, pageNumber });
		const sortDirectionToNumber = sortDirection === SortDirectionEnum.Asc ? 1 : -1;

		const totalCount = await UserModel.countDocuments({
			login: { $regex: searchLoginTerm ?? '', $options: 'i' },
			email: { $regex: searchEmailTerm ?? '', $options: 'i' },
		});

		const documents = await UserModel.find({
			login: { $regex: searchLoginTerm ?? '', $options: 'i' },
			email: { $regex: searchEmailTerm ?? '', $options: 'i' },
		})
			.sort({ [sortBy]: sortDirectionToNumber })
			.limit(pageSize)
			.skip(skip);

		const pagesCount = this.countTotalPages(totalCount, pageSize);

		return { documents, totalCount, pagesCount };
	}
}
