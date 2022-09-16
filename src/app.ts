import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';

import { blackListMiddleware } from './middlewares/black-list.middleware';
import { requestCounterMiddleware } from './middlewares/request-counter.middleware';
import { loggerMiddleware } from './middlewares/loggerMiddleware';

import { testingRouter } from './routes/testing-router';
import { userRouter } from './modules/user/router';
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
import './modules/comments/comments.controller';
import './modules/post/post.controller.inversify';
import './modules/auth/auth.controller';

const server = new InversifyExpressServer(iocContainer, null, null, expressApp);
export const app = server.build();
