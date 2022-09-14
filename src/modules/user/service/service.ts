import { injectable, inject } from 'inversify';

import { AbstractUserService } from '@models/user/service/_service.types';
import { UserDatabase, UserInputInterface, UserOutputInterface } from '@models/user/types/entities';
import { PasswordServiceInterface } from '../../../services/passwordService/interfaces';
import { IOC_TYPES } from '../../../_inversify/inversify.types';
import { AbstractUserDatabaseRepository } from '../repository/_repository.types';
import { GetAllUsersQueryParams } from '@models/user/controllers/controller.types';
import { GetAllRepositoryResponse, HashedPassword, ModelID } from '../../_base/types';

@injectable()
export class UserService implements AbstractUserService {
	constructor(
		@inject(IOC_TYPES.PasswordService) private readonly passwordService: PasswordServiceInterface,
		@inject(IOC_TYPES.UserDatabaseRepository) private readonly userDatabaseRepository: AbstractUserDatabaseRepository,
	) {}

	public async createUser({
		login,
		email,
		password: unhashedPassword,
	}: UserInputInterface): Promise<UserOutputInterface> {
		const hashedPassword: HashedPassword = await this.passwordService.hashPassword(unhashedPassword);
		const newUser = await this.userDatabaseRepository.create({ login, email, password: hashedPassword });
		return this.prepareUserModel(newUser);
	}

	public async deleteUser(id: ModelID): Promise<boolean> {
		return await this.userDatabaseRepository.delete(id);
	}

	public async getAllUsers(params: GetAllUsersQueryParams): Promise<GetAllRepositoryResponse<UserOutputInterface>> {
		const { documents, totalCount, pagesCount } = await this.userDatabaseRepository.getAll(params);
		return { documents: documents.map(this.prepareUserModel), totalCount, pagesCount };
	}

	public async drop(): Promise<void> {
		await this.userDatabaseRepository.drop();
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
