import { Response } from 'express';
import { HttpStatusesEnum } from '../../enums';
import { ValidationError } from 'class-validator';
import { ErrorMessageInterface } from '@app/interfaces';

export abstract class AbstractErrorBoundaryService {
	abstract sendError: <T extends Response>(response: T, error: any, status?: HttpStatusesEnum, message?: string) => T;
	abstract generateErrorFromClassValidator: (errors: ValidationError[]) => ErrorMessageInterface;
}
