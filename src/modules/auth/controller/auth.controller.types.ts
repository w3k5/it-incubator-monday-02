import { UnhashedPassword, UserLogin } from '../../_base/types';
import { NextFunction, Response } from 'express';
import { AccessToken } from '../../../services/tokenService/interfaces';
import { RequestWithBody } from '../../../_common/types';

export abstract class AbstractAuthController {
	abstract login(request: LoginRequest, response: LoginResponse, next: NextFunction): Promise<LoginResponse>;
}

export type LoginUserDto = { login: UserLogin; password: UnhashedPassword };
export type LoginRequest = RequestWithBody<LoginUserDto>;
export type LoginResponse = Response<AccessToken | never>;
