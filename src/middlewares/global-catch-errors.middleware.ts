import { Request, Response } from 'express';
import { ServerError } from '../_common/types';

export const globalCatchErrorsMiddleware = (
	{ status, message, error, endpoint, route }: ServerError,
	request: Request,
	response: Response,
) => {
	return response.status(status).send({ status, message, error, route, endpoint });
};
