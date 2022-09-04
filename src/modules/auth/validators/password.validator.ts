import { ValidationChain } from 'express-validator';

export const passwordValidator = (chain: ValidationChain): ValidationChain => {
	return chain.exists().trim().isString().withMessage('Password must be a string!').isLength({ min: 1 });
};
