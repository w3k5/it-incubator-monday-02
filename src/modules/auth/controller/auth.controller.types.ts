import { UnhashedPassword, UserLogin } from '../../_base/types';
import { EmptyResponse, RequestWithBody } from '@app/common-types';
import { NextFunction } from 'express';

export interface AuthControllerInterface {
	login(request: LoginRequest, response: EmptyResponse, next: NextFunction): Promise<EmptyResponse>;
}

export type LoginUserDto = { login: UserLogin; password: UnhashedPassword };
export type LoginRequest = RequestWithBody<LoginUserDto>;
