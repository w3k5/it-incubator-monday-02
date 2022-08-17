import { ValidationChain } from 'express-validator';

export const bloggerIdValidator = (chain: ValidationChain): ValidationChain => {
	return chain.isNumeric().withMessage('bloggerId must be a number!');
};
