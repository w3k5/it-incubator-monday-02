import { runDb } from './db';
import { app as expressApp } from './app';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './_common/errors/exception-filters/http-exception.filter';
import { BadRequestEmptyExceptionFilter } from './_common/errors/exception-filters/bad-request-empty-exception.filter';
import { BadRequestExceptionFilter } from './_common/errors/exception-filters/bad-request-exception.filter';

const port = process.env.PORT || 3000;

const bootstrap = async () => {
	await runDb();
	const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			stopAtFirstError: true,
			exceptionFactory: (errors) => {
				const errorsMessages = errors.map(({ constraints, property }) => {
					const constraintsFirstError = constraints ? Object.values(constraints)[0] : 'Something went wrong';
					return {
						message: constraintsFirstError,
						field: property,
					};
				});
				throw new BadRequestException(errorsMessages);
			},
		}),
	);
	app.useGlobalFilters(new BadRequestEmptyExceptionFilter(), new BadRequestExceptionFilter());
	await app.listen(port);
	console.log(`IT-Incubator has been started at port: ${port}`);
};

bootstrap().catch((error) => {
	console.log('Application unexpectedly shutdown!', error.message);
});
