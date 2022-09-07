import { Router } from 'express';
import { authController } from '../../_inversify/inversify.config';
import { loginMethodValidators } from './validators/login-method.validators';

export const authRouter = Router({ caseSensitive: true });

authRouter.post('/login', loginMethodValidators, authController.login.bind(authController));
