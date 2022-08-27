import { param } from 'express-validator';
import { ObjectId } from 'mongodb';

export const mongoIdParamValidator = param('id')
	.exists()
	.custom((id) => {
		const isIdValid = ObjectId.isValid(id);
		if (!isIdValid) {
			throw new Error('Mongo ID must be valid!');
		}
		return true;
	});
