import { ValidationChain } from 'express-validator';

export const contentValidator = (chain: ValidationChain): ValidationChain => {
	return chain
		.isString()
		.withMessage('content must be a string!')
		.isLength({ min: 1, max: 1000 })
		.withMessage(
			'content length must be greater than 1 and less or equal 1000 ',
		);
};
