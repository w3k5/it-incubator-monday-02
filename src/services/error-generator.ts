import { ValidationError } from 'express-validator';
import { ErrorInterface, ErrorMessageInterface } from '@app/interfaces';

const generateError = (error: ValidationError): ErrorInterface => {
	return {
		message: error.msg,
		field: error.param,
	};
};

const collectUniqueErrors = (errors: ValidationError[]) => {
	return errors.reduce((errorsAccumulator: ValidationError[], error) => {
		const errorCandidate = errorsAccumulator.find((err) => err.param === error.param);
		if (!errorCandidate) {
			return [...errorsAccumulator, error];
		}
		return errorsAccumulator;
	}, []);
};

export const generateErrorsResponse = (errors: ValidationError[]): ErrorMessageInterface => {
	return {
		errorsMessages: collectUniqueErrors(errors).map(generateError),
	};
};
