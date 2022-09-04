import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { AuthServiceInterface } from './auth.service.types';
import { IOC_TYPES } from '../../../_inversify/inversify.types';
import { UserDatabaseRepositoryType } from '../../user/repository/repository.interface';
import { LoginUserDto } from '../controller/auth.controller.types';
import { PasswordServiceInterface } from '../../../services/passwordService/interfaces';

@injectable()
export class AuthService implements AuthServiceInterface {
	constructor(
		@inject(IOC_TYPES.UserDatabaseRepository) private readonly userRepository: UserDatabaseRepositoryType,
		@inject(IOC_TYPES.PasswordService) private readonly passwordService: PasswordServiceInterface,
	) {}

	async isAuth({ login, password }: LoginUserDto): Promise<boolean> {
		const candidate = await this.userRepository.getByLogin(login);

		if (!candidate) {
			return false;
		}

		return await this.passwordService.check(password, candidate.password);
	}
}
