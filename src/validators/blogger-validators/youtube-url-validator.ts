import { ValidationChain } from 'express-validator';

export const youtubeUrlValidator = (
	chain: ValidationChain,
): ValidationChain => {
	return chain
		.isString()
		.withMessage('youtubeUrl must be a string!')
		.isLength({
			min: 1,
			max: 100,
		})
		.withMessage('Name length must be greater than 1 and less or equal 100 ')
		.matches(
			/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
		)
		.withMessage('youtubeUrl must be a valid URL!');
};
