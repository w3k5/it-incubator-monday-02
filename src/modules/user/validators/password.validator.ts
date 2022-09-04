import { ValidationChain } from 'express-validator';

export const passwordValidator = (chain: ValidationChain): ValidationChain => {
	return chain
		.trim()
		.isString()
		.withMessage('Password must be a string!')
		.isLength({
			min: 6,
			max: 20,
		})
		.withMessage('Password length must be greater than 6 and less or equal 20 ');
};
