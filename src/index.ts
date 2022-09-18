import { runDb } from './db';
import { app as expressApp } from './app';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './modules/app/app.module';

const port = process.env.PORT || 3000;

const startApp = async () => {
	await runDb();
	const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
	await app.listen(port);
	console.log(`IT-Incubator homework monday-2 has been started at port: ${port}`);
};

startApp().catch((error) => {
	console.log('Application unexpectedly shutdown!', error.message);
});
