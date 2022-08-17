import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { postsRouter } from './routes/posts/posts-router';
import { bloggersRouter } from './routes/bloggers/bloggers-router';
import { blackListMiddleware } from './middlewares/black-list.middleware';
import { contentTypeCheckerMiddleware } from './middlewares/content-type-checker.middleware';
import { requestCounterMiddleware } from './middlewares/request-counter.middleware';
import { Repository } from './repositories/repository';
import { BloggerInterface, PostInterface } from '@app/interfaces';

export const postsRepository = new Repository<PostInterface>([]);
export const bloggersRepository = new Repository<BloggerInterface>([]);

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

/**
 * App Middlewares
 */
app.use(requestCounterMiddleware);
app.use(blackListMiddleware);
// app.use(contentTypeCheckerMiddleware);

/**
 * Routes
 */
app.use('/posts', postsRouter);
app.use('/bloggers', bloggersRouter);

app.listen(port, () => {
	console.log(
		`IT-Incubator homework monday-2 has been started at port: ${port}`,
	);
});
