import { injectable, inject } from 'inversify';

import { UserServiceInterface } from '@models/user/service/_service.types';
import {
	GetAllDomainResponse,
	UserDatabase,
	UserInputInterface,
	UserOutputInterface,
} from '@models/user/types/entities';
import { PasswordServiceInterface } from '../../../services/passwordService/interfaces';
import { IOC_TYPES } from '../../../_inversify/inversify.types';
import { AbstractUserDatabaseRepository } from '../repository/_repository.types';
import { GetAllUsersQueryParams } from '@models/user/controllers/controller.types';
import { HashedPassword, ModelID } from '../../_base/types';

@injectable()
export class UserService implements UserServiceInterface {
	constructor(
		@inject(IOC_TYPES.PasswordService) private readonly passwordService: PasswordServiceInterface,
		@inject(IOC_TYPES.UserDatabaseRepository) private readonly userRepository: AbstractUserDatabaseRepository,
	) {}

	public async createUser({
		login,
		email,
		password: unhashedPassword,
	}: UserInputInterface): Promise<UserOutputInterface> {
		const hashedPassword: HashedPassword = await this.passwordService.hashPassword(unhashedPassword);
		const newUser = await this.userRepository.create({ login, email, password: hashedPassword });
		const result: UserOutputInterface = this.prepareUserModel(newUser);
		return result;
	}

	public async deleteUser(id: ModelID): Promise<boolean> {
		return await this.userRepository.delete(id);
	}

	public async getAllUsers(params: GetAllUsersQueryParams): Promise<GetAllDomainResponse> {
		const { documents, totalCount, pagesCount } = await this.userRepository.getAll(params);
		return { documents: documents.map(this.prepareUserModel), totalCount, pagesCount };
	}

	private prepareUserModel({ email, login, createdAt, _id }: UserDatabase): UserOutputInterface {
		return {
			email,
			login,
			createdAt,
			id: _id.toString(),
		};
	}
}
