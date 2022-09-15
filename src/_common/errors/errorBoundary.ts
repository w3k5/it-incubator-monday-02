import { Response } from 'express';
import { NotFoundError } from './notFoundError';
import { HttpStatusesEnum } from '../../enums';
import { injectable } from 'inversify';
import { AbstractErrorBoundaryService } from './errorBoundaryService.types';
import { NotAuthorizedError } from './notAuthorizedError';

@injectable()
export class ErrorBoundaryService implements AbstractErrorBoundaryService {
	sendError<T extends Response>(response: T, error: any, status?: HttpStatusesEnum): T {
		if (error instanceof NotFoundError) {
			return response.status(HttpStatusesEnum.NOT_FOUND).send();
		}

		if (error instanceof NotAuthorizedError) {
			return response.status(HttpStatusesEnum.NOT_AUTHORIZED).send();
		}

		return response.status(HttpStatusesEnum.SERVER_ERROR).send({ error: error.message || error });
	}
}
