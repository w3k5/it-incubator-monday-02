import 'reflect-metadata';
import { injectable, inject } from 'inversify';

import { UserServiceInterface } from '@models/user/service/service.types';
import {
	GetAllDomainResponse,
	UserDatabase,
	UserInputInterface,
	UserOutputInterface,
} from '@models/user/types/entities';
import { HashedPassword } from '@models/user/types/primitives';
import { PasswordServiceInterface } from '../../../services/passwordService/interfaces';
import { IOC_TYPES } from '../../../inversify/inversify.types';
import { UserDatabaseRepositoryType } from '../repository/repository.interface';
import { GetAllUsersQueryParams } from '@models/user/controllers/controller.types';

@injectable()
export class UserService implements UserServiceInterface {
	constructor(
		@inject(IOC_TYPES.PasswordService) private readonly passwordService: PasswordServiceInterface,
		@inject(IOC_TYPES.UserDatabaseRepository) private readonly userRepository: UserDatabaseRepositoryType,
	) {}

	async createUser({ login, email, password: unhashedPassword }: UserInputInterface): Promise<UserOutputInterface> {
		const hashedPassword: HashedPassword = await this.passwordService.hashPassword(unhashedPassword);
		const newUser = await this.userRepository.create({ login, email, password: hashedPassword });
		const result: UserOutputInterface = this.prepareModel(newUser);
		return result;
	}

	async deleteUser(id: string): Promise<boolean> {
		return await this.userRepository.delete(id);
	}

	async getAllUsers(params: GetAllUsersQueryParams): Promise<GetAllDomainResponse> {
		const { documents, totalCount, pagesCount } = await this.userRepository.getAll(params);
		return { documents: documents.map(this.prepareModel), totalCount, pagesCount };
	}

	private prepareModel({ email, login, createdAt, _id }: UserDatabase): UserOutputInterface {
		return {
			email,
			login,
			createdAt,
			id: _id.toString(),
		};
	}
}
