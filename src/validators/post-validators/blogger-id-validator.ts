import { ValidationChain } from 'express-validator';
import { bloggersRepository } from '../../index';
import { ObjectId } from 'mongodb';

export const bloggerIdValidator = (chain: ValidationChain): ValidationChain => {
	return chain.isInt().toInt();
	// .custom(async (id) => {
	// 	const isIdValid = ObjectId.isValid(id);
	// 	if (!isIdValid) {
	// 		throw new Error('Mongo ID must be valid!');
	// 	}
	// 	return true;
	// });
};
