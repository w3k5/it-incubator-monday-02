import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { generateError } from '../services/error-generator';
import { HttpStatusesEnum } from '../enums';

export const inputValidationMiddleware = (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	const errors = validationResult(request);

	if (!errors.isEmpty()) {
		const preparedErrors = {
			errorMessages: errors.array().map(generateError),
		};
		return response.status(HttpStatusesEnum.BAD_REQUEST).send(preparedErrors);
	}

	next();
};
