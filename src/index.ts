import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';

import { runDb } from './db';
import { blackListMiddleware } from './middlewares/black-list.middleware';
import { requestCounterMiddleware } from './middlewares/request-counter.middleware';
import { loggerMiddleware } from './middlewares/loggerMiddleware';
import { globalCatchErrorsMiddleware } from './middlewares/global-catch-errors.middleware';

import { testingRouter } from './routes/testing-router';
import { userRouter } from './modules/user/router';
import { authRouter } from './modules/auth/router';
import { blogsRouter } from './modules/blogs/blogs.router';
import { postRouter } from './modules/post/post.router';

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
app.use('/posts', postRouter);
app.use('/blogs', blogsRouter);
app.use('/testing', testingRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use(globalCatchErrorsMiddleware);

const startApp = async () => {
	await runDb();
	app.listen(port, () => {
		console.log(` IT-Incubator homework monday-2 has been started at port: ${port} `);
	});
};

startApp().catch((error) => {
	console.log('Application unexpectedly shutdown!', error.message);
});
