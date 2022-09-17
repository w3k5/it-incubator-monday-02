import {Response} from 'express';
import {NotFoundError} from './notFoundError';
import {HttpStatusesEnum} from '../../enums';
import {injectable} from 'inversify';
import {AbstractErrorBoundaryService} from './errorBoundaryService.types';
import {NotAuthorizedError} from './notAuthorizedError';
import {ValidationError} from 'class-validator';
import {ErrorMessageInterface} from '@app/interfaces';

@injectable()
export class ErrorBoundaryService implements AbstractErrorBoundaryService {
	sendError<T extends Response>(response: T, error: any, status?: HttpStatusesEnum): T {
		if (error instanceof NotFoundError) {
			return response.status(HttpStatusesEnum.NOT_FOUND).send();
		}

		if (error instanceof NotAuthorizedError) {
			return response.status(HttpStatusesEnum.NOT_AUTHORIZED).send();
		}

		console.log(error);
		return response.status(HttpStatusesEnum.SERVER_ERROR).send({error: error.message || error});
	}

	generateErrorFromClassValidator(errors: ValidationError[]): ErrorMessageInterface {
		return {
			errorsMessages: errors.map(({constraints, property}) => {
				const constraintsFirstError = constraints ? Object.values(constraints)[0] : 'Something went wrong';
				return {
					message: constraintsFirstError,
					field: property,
				};
			}),
		};
	}
}
