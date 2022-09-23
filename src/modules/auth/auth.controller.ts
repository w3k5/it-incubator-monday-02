import { BaseHttpController, controller, httpPost, request, requestBody, response } from 'inversify-express-utils';
import { AbstractAuthController, LoginRequest, LoginResponse } from './controller/auth.controller.types';
import { inject } from 'inversify';
import { IOC_TYPES, REPOSITORIES_TYPES, SERVICES_TYPES } from '../../_inversify/inversify.types';
import { AbstractAuthService } from './service/auth.service.types';
import { AbstractTokenService, Token } from '../../services/tokenService/interfaces';
import { AbstractErrorBoundaryService } from '../../_common/errors/errorBoundaryService.types';
import { HttpStatusesEnum } from '../../enums';
import { LoginBodyDto } from './dto/loginBody.dto';
import { transformAndValidate } from 'class-transformer-validator';
import { Response } from 'express';
import { RegisterBodyDto } from './dto/registerBody.dto';
import { ConfirmationCodeBodyDto } from './dto/confirmationCodeBody.dto';
import { AbstractActivationService } from '../activation/types/activation.service.abstract';
import { ResendingCodeBodyDto } from './dto/resendingCodeBody.dto';
import { AbstractUserDatabaseRepository } from '../user/repository/_repository.types';
import { AbstractActivationRepositoryQuery } from '../activation/types/activation.repository.query.abstract';
import { ErrorMessageInterface } from '@app/interfaces';

@controller('/auth')
export class AuthController extends BaseHttpController implements AbstractAuthController {
	constructor(
		@inject(IOC_TYPES.AuthService) private readonly authService: AbstractAuthService,
		@inject(IOC_TYPES.TokenService) private readonly tokenService: AbstractTokenService,
		@inject(IOC_TYPES.ErrorBoundaryService) private readonly errorBoundary: AbstractErrorBoundaryService,
		@inject(SERVICES_TYPES.ActivationService) private readonly activationService: AbstractActivationService,
		@inject(IOC_TYPES.UserDatabaseRepository)
		private readonly userDatabaseRepository: AbstractUserDatabaseRepository,
		@inject(REPOSITORIES_TYPES.ActivationQueryRepository)
		private readonly activationQueryRepository: AbstractActivationRepositoryQuery,
	) {
		super();
	}

	@httpPost('/login')
	async login(
		@request() request: LoginRequest,
		@response() response: LoginResponse,
		@requestBody() body: LoginBodyDto,
	): Promise<LoginResponse | any> {
		try {
			const validatedBody = await transformAndValidate(LoginBodyDto, body);
			const result: Token = await this.authService.auth({
				login: validatedBody.login,
				password: validatedBody.password,
			});
			return response.status(HttpStatusesEnum.OK).send({ accessToken: result });
		} catch (error) {
			if (Array.isArray(error)) {
				return response
					.status(HttpStatusesEnum.BAD_REQUEST)
					.send(this.errorBoundary.generateErrorFromClassValidator(error));
			}
			return this.errorBoundary.sendError<LoginResponse>(response, error);
		}
	}

	@httpPost('/registration')
	async registration(@response() response: Response, @requestBody() body: RegisterBodyDto) {
		try {
			const validatedBody = await transformAndValidate(RegisterBodyDto, body);
			const userCandidateByLogin = await this.userDatabaseRepository.getByLogin(validatedBody.login);
			const userCandidateByEmail = await this.userDatabaseRepository.getByEmail(validatedBody.email);
			if (userCandidateByLogin) {
				return response
					.status(HttpStatusesEnum.BAD_REQUEST)
					.send(this.generateError('User with that login' + ' already exists', 'login'));
			}

			if (userCandidateByEmail) {
				return response
					.status(HttpStatusesEnum.BAD_REQUEST)
					.send(this.generateError('User with that email already exists', 'email'));
			}
			const result = await this.authService.registration(validatedBody);
			return response.status(HttpStatusesEnum.NO_CONTENT).send();
		} catch (error) {
			if (Array.isArray(error)) {
				return response
					.status(HttpStatusesEnum.BAD_REQUEST)
					.send(this.errorBoundary.generateErrorFromClassValidator(error));
			}
			return this.errorBoundary.sendError<Response>(response, error);
		}
	}

	@httpPost('/registration-confirmation')
	async registrationConfirmation(
		@response() response: Response,
		@requestBody() confirmationCodeBodyDto: ConfirmationCodeBodyDto,
	) {
		try {
			const validateBody = await transformAndValidate(ConfirmationCodeBodyDto, confirmationCodeBodyDto);
			const isNotActivated = await this.activationService.activate(validateBody.code);
			if (!isNotActivated) {
				return response.status(HttpStatusesEnum.BAD_REQUEST).send(this.generateError('User already activated', 'code'));
			}
			return response.status(HttpStatusesEnum.NO_CONTENT).send();
		} catch (error) {
			if (Array.isArray(error)) {
				return response
					.status(HttpStatusesEnum.BAD_REQUEST)
					.send(this.errorBoundary.generateErrorFromClassValidator(error));
			}
			return this.errorBoundary.sendError<Response>(response, error);
		}
	}

	@httpPost('/registration-email-resending')
	async resendConfirmationEmail(
		@response() response: Response,
		@requestBody() resendingCodeBody: ResendingCodeBodyDto,
	) {
		try {
			const validatedBody = await transformAndValidate(ResendingCodeBodyDto, resendingCodeBody);
			const userCandidate = await this.userDatabaseRepository.getByEmail(validatedBody.email);
			if (!userCandidate) {
				return response
					.status(HttpStatusesEnum.BAD_REQUEST)
					.send(this.generateError('User with that email is not exists', 'email'));
			}
			const activationCandidate = await this.activationQueryRepository.getActivationInstanceByUserId(userCandidate._id);
			if (!activationCandidate) {
				return response.status(HttpStatusesEnum.NO_CONTENT).send();
			}

			if (activationCandidate.isActivated) {
				return response
					.status(HttpStatusesEnum.BAD_REQUEST)
					.send(this.generateError('User already activated', 'email'));
			}

			await this.authService.resendConfirmation(validatedBody.email, activationCandidate.code);

			return response.status(HttpStatusesEnum.NO_CONTENT).send();
		} catch (error) {
			if (Array.isArray(error)) {
				return response
					.status(HttpStatusesEnum.BAD_REQUEST)
					.send(this.errorBoundary.generateErrorFromClassValidator(error));
			}
			return this.errorBoundary.sendError<Response>(response, error);
		}
	}

	private generateError(message: string, field: string): ErrorMessageInterface {
		return {
			errorsMessages: [
				{
					message,
					field,
				},
			],
		};
	}
}
