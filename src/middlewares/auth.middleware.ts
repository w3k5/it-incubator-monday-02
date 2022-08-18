import { NextFunction, Request, Response } from 'express';

export const authMiddleware = (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	if (!request.headers || typeof request.headers === 'undefined') {
		return response.status(401).send();
	}

	const authorization = request.header('authorization');

	if (!authorization) {
		return response.status(401).send();
	}

	const [_, hashedPassword] = authorization.split(' ');
	const [login, password] = Buffer.from(hashedPassword, 'base64')
		.toString('ascii')
		.split(':');

	if (login === process.env.LOGIN && password === process.env.PASSWORD) {
		return next();
	}
	return response.status(401).send();
};
