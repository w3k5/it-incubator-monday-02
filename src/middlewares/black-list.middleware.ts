import { NextFunction, Request, Response } from 'express';
import { HttpStatusesEnum } from '../enums';

const blackList = new Set<string>();

export const blackListMiddleware = (request: Request, response: Response, next: NextFunction) => {
	const { ip } = request;
	if (blackList.has(ip)) {
		return response.status(HttpStatusesEnum.NOT_ALLOWED).send();
	}
	next();
};
