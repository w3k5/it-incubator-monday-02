import { inject, injectable } from 'inversify';
import { AbstractAuthService } from './auth.service.types';
import { GLOBAL_SERVICES_TYPES, IOC_TYPES, SERVICES_TYPES } from '../../../_inversify/inversify.types';
import { AbstractUserDatabaseRepository } from '../../user/repository/_repository.types';
import { LoginUserDto } from '../controller/auth.controller.types';
import { PasswordServiceInterface } from '../../../services/passwordService/interfaces';
import { AbstractTokenService, AccessToken, Token } from '../../../services/tokenService/interfaces';
import { NotAuthorizedError } from '../../../_common/errors';
import { RegisterBodyDto } from '../dto/registerBody.dto';
import { RegistrationServiceControllerInterface } from '../dto/registrationServiceController.interface';
import { AbstractActivationService } from '../../activation/types/activation.service.abstract';
import { AbstractUserService } from '../../user/service/_service.types';
import { UserDatabase } from '@models/user/types/entities';
import { ActivationDatabaseModel } from '../../activation/entities';
import { AbstractMailerService } from '../../../services/mailer/mailer.service.abstract';
import { UserEmail } from '../../_base/types';

@injectable()
export class AuthService implements AbstractAuthService {
	constructor(
		@inject(SERVICES_TYPES.ActivationService) private readonly activationService: AbstractActivationService,
		@inject(IOC_TYPES.UserDatabaseRepository) private readonly userRepository: AbstractUserDatabaseRepository,
		@inject(IOC_TYPES.PasswordService) private readonly passwordService: PasswordServiceInterface,
		@inject(IOC_TYPES.TokenService) private readonly tokenService: AbstractTokenService,
		@inject(IOC_TYPES.UserService) private readonly userService: AbstractUserService,
		@inject(GLOBAL_SERVICES_TYPES.EmailService) private readonly mailerService: AbstractMailerService,
	) {}

	public async auth({ login, password }: LoginUserDto): Promise<Token> {
		const candidate = await this.userRepository.getByLogin(login);

		if (!candidate) {
			throw new NotAuthorizedError();
		}

		const isPasswordCorrect = await this.passwordService.check(password, candidate.password);

		if (!isPasswordCorrect) {
			throw new NotAuthorizedError();
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

	public async registration({
		password,
		login,
		email,
	}: RegisterBodyDto): Promise<RegistrationServiceControllerInterface> {
		const createdUser: UserDatabase = await this.userService.createUserV2({ password, login, email });
		const createdActivation: ActivationDatabaseModel = await this.activationService.createActivationCode({
			userId: createdUser._id,
		});
		const messageBody = `
		 <h1>Thank for your registration</h1>
       		<p>
          		<a href='https://weksik.ru/confirm-email?code=${createdActivation.code}'>complete registration</a>
      		</p>
		 </h1>`;

		await this.mailerService.sendMessage(createdUser.email, messageBody);
		return {
			user: createdUser,
			activation: createdActivation,
		};
	}

	public async resendConfirmation(email: UserEmail, code: string): Promise<void> {
		const messageBody = `
		 <h1>Are you fucking kidding me? How did you didnt got confrirmation</h1>
       		<p>
          		<a href='https://weksik.ru/confirm-email?code=${code}'>Use it again</a>
      		</p>
		 </h1>`;
		await this.mailerService.sendMessage(email, messageBody);
	}
}
