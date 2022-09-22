import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { BadRequestEmptyException } from '../exceptions/badRequestEmpty.exception';

@Catch(BadRequestEmptyException)
export class BadRequestEmptyExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();
		response.status(status).send();
	}
}
