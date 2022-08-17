import { ValidationChain } from 'express-validator';

export const nameValidator = (chain: ValidationChain): ValidationChain => {
	return chain
		.isString()
		.withMessage('Name must be a string!')
		.isLength({ min: 1, max: 15 })
		.withMessage('Name length must be greater than 1 and less or equal 15 ');
};
