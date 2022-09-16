import { runDb } from './db';
import { app } from './app';
import { Container } from 'inversify';
import { controller, httpGet, interfaces, InversifyExpressServer, request, response } from 'inversify-express-utils';
import express from 'express';
import { iocContainer } from './_inversify/inversify.config';

const port = process.env.PORT || 3000;

const startApp = async () => {
	await runDb();

	app.listen(port, () => {
		console.log(` IT-Incubator homework monday-2 has been started at port: ${port} `);
	});
};

startApp().catch((error) => {
	console.log('Application unexpectedly shutdown!', error.message);
});
