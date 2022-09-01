import { ValidationChain } from 'express-validator';
import { ObjectId } from 'mongodb';
import { bloggerDomain } from '../../handlers/blogger.handlers';

export const bloggerIdValidator = (chain: ValidationChain): ValidationChain => {
	return chain
		.custom(async (id) => {
			const isIdValid = ObjectId.isValid(id);
			if (!isIdValid) {
				throw new Error('Mongo ID must be valid!');
			}
			return true;
		})
		.custom(async (value: string) => {
			const bloggerCandidate = await bloggerDomain.getBloggerById(value);
			if (!bloggerCandidate) {
				throw new Error('Blogger is not exists');
			}
			return true;
		});
};
