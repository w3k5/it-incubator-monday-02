import { ValidationChain } from 'express-validator';

export const shortDescriptionValidator = (
	chain: ValidationChain,
): ValidationChain => {
	return chain
		.isString()
		.withMessage('shortDescription must be a string!')
		.isLength({
			min: 1,
			max: 100,
		})
		.withMessage(
			'shortDescription length must be greater than 1 and less or equal 100 ',
		);
};
