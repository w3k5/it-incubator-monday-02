import { NextFunction } from 'express';
import { ServerErrorInterface } from '@app/interfaces';
import { NotFoundError } from './notFoundError';

export const errorHandler = (error: Error, next: NextFunction, options?: Partial<ServerErrorInterface>) => {
	if (error instanceof NotFoundError) {
		return next({
			status: 404,
			message: options?.message || 'Not Found',
			error: options?.message || error.message || 'something went wrong',
			route: options?.route || 'unknown',
			endpoint: options?.endpoint || 'unknown',
		});
	}
	return next({
		status: options?.status || 500,
		message: options?.message || 'Internal server error',
		error: options?.message || error.message || 'something went wrong',
		route: options?.route || 'unknown',
		endpoint: options?.endpoint || 'unknown',
	});
};

export * from './notFoundError';
export * from './notAuthorizedError';
