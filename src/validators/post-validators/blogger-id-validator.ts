import { ValidationChain } from 'express-validator';
import { bloggersRepository } from '../../index';
import { ObjectId } from 'mongodb';

export const bloggerIdValidator = (chain: ValidationChain): ValidationChain => {
	return chain
		.custom(async (id) => {
			const isIdValid = ObjectId.isValid(id);
			if (!isIdValid) {
				throw new Error('Mongo ID must be valid!');
			}
			return true;
		})
		.custom(async (value, meta) => {
			const bloggerCandidate = await bloggersRepository.getById(value);
			if (!bloggerCandidate) {
				throw new Error('Blogger is not exists');
			}
			meta.req.blogger = bloggerCandidate;
			return true;
		});
};
