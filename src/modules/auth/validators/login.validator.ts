import { ValidationChain } from 'express-validator';

export const loginValidator = (chain: ValidationChain): ValidationChain => {
	return chain.exists().trim().isString().withMessage('Login must be a string!').isLength({ min: 1 });
};
