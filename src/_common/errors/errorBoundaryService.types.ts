import { Response } from 'express';
import { HttpStatusesEnum } from '../../enums';

export abstract class AbstractErrorBoundaryService {
	abstract sendError: <T extends Response>(response: T, error: any, status?: HttpStatusesEnum, message?: string) => T;
}
