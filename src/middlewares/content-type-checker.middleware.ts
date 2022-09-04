import { NextFunction, Request, Response } from 'express';
import { HttpStatusesEnum } from '../enums';

export const contentTypeCheckerMiddleware = (request: Request, response: Response, next: NextFunction) => {
	const contentType = request.header('content-type');

	if (!request.is('service/json') && contentType !== 'service/json') {
		return response.status(HttpStatusesEnum.BAD_REQUEST).send('Bad content type');
	}

	next();
};
