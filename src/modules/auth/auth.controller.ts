import { BaseHttpController, controller, httpPost, request, requestBody, response } from 'inversify-express-utils';
import { AbstractAuthController, LoginRequest, LoginResponse } from './controller/auth.controller.types';
import { inject } from 'inversify';
import { IOC_TYPES } from '../../_inversify/inversify.types';
import { AbstractAuthService } from './service/auth.service.types';
import { AbstractTokenService, Token } from '../../services/tokenService/interfaces';
import { AbstractErrorBoundaryService } from '../../_common/errors/errorBoundaryService.types';
import { HttpStatusesEnum } from '../../enums';
import { LoginDto } from './dto/login.dto';
import { transformAndValidate } from 'class-transformer-validator';

@controller('/auth')
export class AuthController extends BaseHttpController implements AbstractAuthController {
	constructor(
		@inject(IOC_TYPES.AuthService) private readonly authService: AbstractAuthService,
		@inject(IOC_TYPES.TokenService) private readonly tokenService: AbstractTokenService,
		@inject(IOC_TYPES.ErrorBoundaryService) private readonly errorBoundary: AbstractErrorBoundaryService,
	) {
		super();
	}

	@httpPost('/login')
	async login(
		@request() request: LoginRequest,
		@response() response: LoginResponse,
		@requestBody() body: LoginDto,
	): Promise<LoginResponse | any> {
		try {
			const validatedBody = await transformAndValidate(LoginDto, body);
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
}
