import { CustomValidator } from 'express-validator';

export const requiredValidator: CustomValidator = (value, meta) => {
	if (!value) {
		throw new Error(`${meta.path} is required!`);
	}
	return true;
};
