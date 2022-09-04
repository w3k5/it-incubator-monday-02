import { loginValidator } from './login.validator';
import { body } from 'express-validator';
import { passwordValidator } from './password.validator';
import { inputValidationMiddleware } from '../../../middlewares/input-validation.middleware';

export const loginMethodValidators = [
	loginValidator(body('login')),
	passwordValidator(body('password')),
	inputValidationMiddleware,
];
