import { ValidationChain } from 'express-validator';

export const loginValidator = (chain: ValidationChain): ValidationChain => {
	return chain
		.trim()
		.isString()
		.withMessage('Login must be a string!')
		.isLength({
			min: 3,
			max: 10,
		})
		.withMessage('Login length must be greater than 3 and less or equal 10 ');
};
