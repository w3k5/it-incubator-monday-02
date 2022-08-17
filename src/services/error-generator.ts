import { ValidationError } from 'express-validator';
export const generateError = (error: ValidationError) => {
	return {
		message: error.msg,
		field: error.param,
	};
};
