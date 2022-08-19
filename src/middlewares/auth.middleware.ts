import { NextFunction, Request, Response } from 'express';

/**
 * Checks is Headers has header Authorization with value Basic login:password
 */
export const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
	if (!request.headers || typeof request.headers === 'undefined') {
		return response.status(401).send();
	}

	const authorization = request.header('authorization');

	if (!authorization) {
		return response.status(401).send();
	}

	const [authorizationName, hashedPassword] = authorization.split(' ');

	if (authorizationName !== 'Basic') {
		return response.status(401).send();
	}

	const [login, password] = Buffer.from(hashedPassword, 'base64').toString('ascii').split(':');

	if (login === process.env.LOGIN && password === process.env.PASSWORD) {
		return next();
	}
	return response.status(401).send();
};
