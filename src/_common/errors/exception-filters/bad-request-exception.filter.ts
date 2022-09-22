import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { ErrorInterface } from '@app/interfaces';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();
		const message = (exception.getResponse() as any).message as ErrorInterface[];

		response.status(status).json({
			errorsMessages: message,
		});
	}
}
