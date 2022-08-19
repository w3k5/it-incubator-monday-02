import { NextFunction, Request, Response } from 'express';

const counterFactory = (initialValue = 0) => {
	let counter = initialValue;
	return () => {
		counter++;
		return counter;
	};
};

const counterInstance = counterFactory();

export const requestCounterMiddleware = (request: Request, response: Response, next: NextFunction) => {
	const counterAmount = counterInstance();
	response.set('requests-count', counterAmount.toString());
	next();
};
