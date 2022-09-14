import { ValidationError } from 'express-validator';
import { ErrorInterface, ErrorMessageInterface } from '@app/interfaces';

const generateError = ({ msg: message, param: field }: ValidationError): ErrorInterface => {
	return {
		message,
		field,
	};
};

export const generateErrorsResponse = (errors: ValidationError[]): ErrorMessageInterface => {
	return {
		errorsMessages: errors.map(generateError),
	};
};
