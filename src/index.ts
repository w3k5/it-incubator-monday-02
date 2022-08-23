import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';

import { runDb } from './db';
import { blackListMiddleware } from './middlewares/black-list.middleware';
import { requestCounterMiddleware } from './middlewares/request-counter.middleware';
import { postsRouter } from './routes/posts-router';
import { bloggersRouter } from './routes/bloggers-router';
import { testingRouter } from './routes/testing-router';
import { BloggerRepository, PostsRepository } from './repositories';
import { loggerMiddleware } from './middlewares/loggerMiddleware';

export const postsRepository = new PostsRepository();
export const bloggersRepository = new BloggerRepository();

/**
 * Setup
 */
config();
export const app = express();
const port = process.env.PORT || 3000;

/**
 * Packages Middlewares
 */
app.use(cors());
app.use(bodyParser.json());
if (process.env.APP_MODE === 'development') {
	app.use(loggerMiddleware);
}

/**
 * App Middlewares
 */
app.use(requestCounterMiddleware);
app.use(blackListMiddleware);

// Описывается в уроках, не работает в тестах домашнего задания - Отключено
// app.use(contentTypeCheckerMiddleware);

/**
 * Routes
 */
app.use('/posts', postsRouter);
app.use('/bloggers', bloggersRouter);
app.use('/testing', testingRouter);

const startApp = async () => {
	await runDb();
	app.listen(port, () => {
		console.log(` IT-Incubator homework monday-2 has been started at port: ${port} `);
	});
};

startApp().catch((error) => {
	console.log('Application unexpectedly shutdown!', error.message);
});
