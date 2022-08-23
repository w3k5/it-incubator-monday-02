import { Response, Request, NextFunction } from 'express';
import chalk from 'chalk';

export const loggerMiddleware = (request: Request, response: Response, next: NextFunction) => {
	const method =
		request.method !== 'DELETE'
			? chalk.yellow(`[REQUEST ${request.method}]`)
			: chalk.red(`[REQUEST ${request.method}]`);
	const path = chalk.green(request.path);
	console.log(`${chalk.bold(method)}: ${path}`);
	next();
};
