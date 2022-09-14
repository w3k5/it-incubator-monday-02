import { inject, injectable } from 'inversify';
import { AbstractAuthController, LoginRequest, LoginResponse } from './auth.controller.types';
import { HttpStatusesEnum } from '../../../enums';
import { IOC_TYPES } from '../../../_inversify/inversify.types';
import { AbstractAuthService } from '../service/auth.service.types';
import { AbstractTokenService, Token } from '../../../services/tokenService/interfaces';
import { AbstractErrorBoundaryService } from '../../../_common/errors/errorBoundaryService.types';
import { NotAuthorizedError } from '../../../_common/errors';

@injectable()
export class AuthController implements AbstractAuthController {
	constructor(
		@inject(IOC_TYPES.AuthService) private readonly authService: AbstractAuthService,
		@inject(IOC_TYPES.TokenService) private readonly tokenService: AbstractTokenService,
		@inject(IOC_TYPES.ErrorBoundaryService) private readonly errorBoundary: AbstractErrorBoundaryService,
	) {}

	async login({ body: { login, password } }: LoginRequest, response: LoginResponse): Promise<LoginResponse> {
		try {
			const result: Token = await this.authService.auth({ login, password });
			return response.status(HttpStatusesEnum.NO_CONTENT).send({ accessToken: result });
		} catch (error) {
			return this.errorBoundary.sendError<LoginResponse>(response, error);
		}
	}
}
