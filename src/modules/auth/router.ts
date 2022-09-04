import { NextFunction, Request, Response, Router } from 'express';
import { authController } from '../../_inversify/inversify.config';
import { LoginRequest } from './controller/auth.controller.types';
import { EmptyResponse } from '@app/common-types';
import { loginMethodValidators } from './validators/login-method.validators';

export const authRouter = Router({ caseSensitive: true });

authRouter.post(
	'/login',
	loginMethodValidators,
	async (request: LoginRequest, response: EmptyResponse, next: NextFunction) => {
		try {
			await authController.login(request, response, next);
		} catch (error: any) {
			next({
				status: 500,
				message: 'Internal server error',
				error: error.message || 'something went wrong',
				route: 'auth',
				endpoint: 'login',
			});
		}
	},
);
