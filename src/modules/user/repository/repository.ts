import { inject, injectable } from 'inversify';
import { AbstractUserDatabaseRepository } from './_repository.types';
import { CreateUserRepositoryDto } from '@models/user/types/dto/createUserRepositoryDto';
import { UserDatabase } from '@models/user/types/entities';
import { UserModel } from '../schema';
import { IOC_TYPES } from '../../../_inversify/inversify.types';
import { DateServiceInterface } from '../../../services/dateService/interfaces';
import { GetAllUsersQueryParams } from '@models/user/controllers/controller.types';
import { SortDirectionEnum } from '../../../enums';
import { LogicalBaseRepository } from '../../_base/repository';
import { GetAllRepositoryResponse } from '../../_base/types';

@injectable()
export class UserDatabaseRepository extends LogicalBaseRepository implements AbstractUserDatabaseRepository {
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
		sortDirection = SortDirectionEnum.desc,
	}: GetAllUsersQueryParams): Promise<GetAllRepositoryResponse<UserDatabase>> {
		const skip = this.skipCount({ pageSize, pageNumber });
		const sortDirectionToNumber = sortDirection === SortDirectionEnum.asc ? 1 : -1;

		const totalCount = await UserModel.countDocuments({
			$or: [
				{ login: { $regex: searchLoginTerm ?? '', $options: 'i' } },
				{ email: { $regex: searchEmailTerm ?? '', $options: 'i' } },
			],
		});

		if (!totalCount) {
			return { documents: [], totalCount: 0, pagesCount: 0 };
		}

		const documents = await UserModel.find({
			$or: [
				{ login: { $regex: searchLoginTerm ?? '', $options: 'i' } },
				{ email: { $regex: searchEmailTerm ?? '', $options: 'i' } },
			],
		})
			.sort({ [sortBy]: sortDirectionToNumber })
			.limit(pageSize)
			.skip(skip);

		const pagesCount = this.countTotalPages(totalCount, pageSize);

		return { documents, totalCount, pagesCount };
	}

	async getByLogin(login: string): Promise<UserDatabase | null> {
		const candidate = await UserModel.findOne({
			$or: [{ login: { $regex: login } }, { email: { $regex: login } }],
		});

		return candidate || null;
	}

	async drop(): Promise<void> {
		await UserModel.deleteMany({});
	}
}
