import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { ServerError } from '@app/common-types';

export const globalCatchErrorsMiddleware = (
	{ status, message, error, endpoint, route }: ServerError,
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	return response.status(status).send({ status, message, error, route, endpoint });
};
