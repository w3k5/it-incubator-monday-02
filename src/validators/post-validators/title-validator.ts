import { ValidationChain } from 'express-validator';

export const titleValidator = (chain: ValidationChain): ValidationChain => {
	return chain
		.trim()
		.isString()
		.withMessage('title must be a string!')
		.isLength({
			min: 1,
			max: 30,
		})
		.withMessage('Title length must be greater than 1 and less or equal 30 ');
};
