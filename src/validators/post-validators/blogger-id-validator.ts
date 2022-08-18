import { ValidationChain } from 'express-validator';
import { bloggersRepository } from '../../index';

export const bloggerIdValidator = (chain: ValidationChain): ValidationChain => {
	return chain
		.isNumeric()
		.withMessage('bloggerId must be a number!')
		.custom(async (value) => {
			const bloggerCandidate = await bloggersRepository.getById(value);
			if (!bloggerCandidate) {
				throw new Error('Blogger with that ID is not exists!');
			}
			return true;
		});
};
