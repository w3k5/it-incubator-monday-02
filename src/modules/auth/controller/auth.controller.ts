import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { AbstractAuthController, LoginRequest, LoginResponse } from './auth.controller.types';
import { HttpStatusesEnum } from '../../../enums';
import { IOC_TYPES } from '../../../_inversify/inversify.types';
import { AbstractAuthService } from '../service/auth.service.types';
import { AbstractTokenService, Token } from '../../../services/tokenService/interfaces';

@injectable()
export class AuthController implements AbstractAuthController {
	constructor(
		@inject(IOC_TYPES.AuthService) private readonly authService: AbstractAuthService,
		@inject(IOC_TYPES.TokenService) private readonly tokenService: AbstractTokenService,
	) {}

	async login({ body: { login, password } }: LoginRequest, response: LoginResponse): Promise<LoginResponse> {
		const result: false | Token = await this.authService.auth({ login, password });

		if (!result) {
			return response.status(HttpStatusesEnum.NOT_AUTHORIZED).send();
		}

		return response.status(HttpStatusesEnum.OK).send({ accessToken: result });
	}
}
