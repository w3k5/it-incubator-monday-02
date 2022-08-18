import { ValidationError } from 'express-validator';

const generateError = (error: ValidationError) => {
	return {
		message: error.msg,
		field: error.param,
	};
};

const collectUniqueErrors = (errors: ValidationError[]) => {
	return errors.reduce((errorsAccumulator: ValidationError[], error) => {
		const errorCandidate = errorsAccumulator.find(
			(err) => err.param === error.param,
		);
		if (!errorCandidate) {
			return [...errorsAccumulator, error];
		}
		return errorsAccumulator;
	}, []);
};

export const generateErrorsResponse = (errors: ValidationError[]) => {
	return {
		errorMessages: collectUniqueErrors(errors).map(generateError),
	};
};
