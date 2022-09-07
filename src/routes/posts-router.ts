import { Router } from 'express';
import { body } from 'express-validator';
import { createPostsValidators } from '../validators/post-validators/create.validator';
import { basicAuthMiddleware } from '../middlewares/basicAuth.middleware';
import { inputValidationMiddleware } from '../middlewares/input-validation.middleware';
import { bloggerIdValidator } from '../validators/post-validators/blogger-id-validator';
import { paginationValidator } from '../validators/pagination.validator';
import { PostHandlers, postsDomain } from '../handlers/post.handlers';
import { getOnePostParamIdValidator } from '../validators/post-validators/posts-id-validator';

export const postsRouter = Router();

const postHandlers = new PostHandlers();

/**
 * Returns all posts
 * */
postsRouter.get('/', paginationValidator, postHandlers.getAllPosts);

/**
 * Creates new post
 */
postsRouter.post(
	'/',
	basicAuthMiddleware,
	bloggerIdValidator(body('bloggerId')),
	createPostsValidators,
	postHandlers.createPost,
);

/**
 * Returns one post by ID
 */
postsRouter.get('/:id', getOnePostParamIdValidator, postHandlers.getPostById);

/**
 * Updates one post by ID
 */
postsRouter.put(
	'/:id',
	basicAuthMiddleware,
	inputValidationMiddleware,
	getOnePostParamIdValidator,
	bloggerIdValidator(body('bloggerId')),
	createPostsValidators,
	inputValidationMiddleware,
	postHandlers.updatePostById,
);

/**
 * Drops full database
 */
postsRouter.delete('/', basicAuthMiddleware, postHandlers.dropCollection);

/**
 * Removes one post by ID
 */
postsRouter.delete('/:id', basicAuthMiddleware, getOnePostParamIdValidator, postHandlers.removePostById);
