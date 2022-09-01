import { ValidationError } from 'express-validator';
import { ErrorInterface, ErrorMessageInterface } from '@app/interfaces';

const generateError = ({ msg: message, param: field }: ValidationError): ErrorInterface => {
	return {
		message,
		field,
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

// export const generateServerError = (Pick<ServerErrorInterface, 'error'>): ServerErrorInterface => {
// 	return {
// 		message: "Internal server error",
// 		status: HttpStatusesEnum.SERVER_ERROR,
// 		error
// 	}
// }
