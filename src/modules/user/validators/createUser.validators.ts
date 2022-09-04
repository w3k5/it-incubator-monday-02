import { body } from 'express-validator';
import { emailValidator } from './email.validator';
import { inputValidationMiddleware } from '../../../middlewares/input-validation.middleware';
import { passwordValidator } from './password.validator';
import { loginValidator } from './login.validator';

export const createUserValidators = [
	emailValidator(body('email')),
	passwordValidator(body('password')),
	loginValidator(body('login')),
	inputValidationMiddleware,
];
