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
import { InversifyExpressServer } from 'inversify-express-utils';
import { iocContainer } from './_inversify/inversify.config';

/**
 * Setup
 */
config();
export const expressApp = express();

/**
 * Packages Middlewares
 */
expressApp.use(cors());
expressApp.use(bodyParser.json());
if (process.env.expressApp_MODE === 'development') {
	expressApp.use(loggerMiddleware);
}

/**
 * expressApp Middlewares
 */
expressApp.use(requestCounterMiddleware);
expressApp.use(blackListMiddleware);

// Описывается в уроках, не работает в тестах домашнего задания - Отключено
// expressApp.use(contentTypeCheckerMiddleware);

/**
 * Routes
 */
expressApp.use('/posts', postRouter);
expressApp.use('/blogs', blogsRouter);
expressApp.use('/testing', testingRouter);
expressApp.use('/users', userRouter);
expressApp.use('/auth', authRouter);
// expressApp.use(globalCatchErrorsMiddleware);
import './modules/comments/comments.controller';
import './modules/post/post.controller.inversify';

const server = new InversifyExpressServer(iocContainer, null, null, expressApp);
export const app = server.build();
