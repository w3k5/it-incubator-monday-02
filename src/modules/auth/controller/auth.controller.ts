import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { AuthControllerInterface, LoginRequest } from './auth.controller.types';
import { EmptyResponse } from '@app/common-types';
import { HttpStatusesEnum } from '../../../enums';
import { IOC_TYPES } from '../../../_inversify/inversify.types';
import { AuthServiceInterface } from '../service/auth.service.types';

@injectable()
export class AuthController implements AuthControllerInterface {
	constructor(@inject(IOC_TYPES.AuthService) private readonly authService: AuthServiceInterface) {}

	async login({ body: { login, password } }: LoginRequest, response: EmptyResponse): Promise<EmptyResponse> {
		const isAuth = await this.authService.isAuth({ login, password });
		const status = isAuth ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_AUTHORIZED;
		return response.status(status).send();
	}
}
