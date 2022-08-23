import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { generateErrorsResponse } from '../helpers/error-generator';
import { HttpStatusesEnum } from '../enums';

export const inputValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {
	const errors = validationResult(request);

	if (!errors.isEmpty()) {
		return response
			.status(HttpStatusesEnum.BAD_REQUEST)
			.send(generateErrorsResponse(errors.array({ onlyFirstError: true })));
	}

	next();
};
