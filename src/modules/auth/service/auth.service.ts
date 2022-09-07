import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { AbstractAuthService } from './auth.service.types';
import { IOC_TYPES } from '../../../_inversify/inversify.types';
import { AbstractUserDatabaseRepository } from '../../user/repository/_repository.types';
import { LoginUserDto } from '../controller/auth.controller.types';
import { PasswordServiceInterface } from '../../../services/passwordService/interfaces';
import { AbstractTokenService, Token } from '../../../services/tokenService/interfaces';

@injectable()
export class AuthService implements AbstractAuthService {
	constructor(
		@inject(IOC_TYPES.UserDatabaseRepository) private readonly userRepository: AbstractUserDatabaseRepository,
		@inject(IOC_TYPES.PasswordService) private readonly passwordService: PasswordServiceInterface,
		@inject(IOC_TYPES.TokenService) private readonly tokenService: AbstractTokenService,
	) {}

	async auth({ login, password }: LoginUserDto) {
		const candidate = await this.userRepository.getByLogin(login);

		if (!candidate) {
			return false;
		}

		const isPasswordCorrect = await this.passwordService.check(password, candidate.password);

		if (!isPasswordCorrect) {
			return false;
		}

		const { login: candidateLogin, email, createdAt, _id: id } = candidate;

		const accessToken: Token = this.tokenService.generate({
			candidateLogin,
			email,
			createdAt,
			id: id.toString(),
		});

		return accessToken;
	}
}
