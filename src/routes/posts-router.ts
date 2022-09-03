import { Router } from 'express';
import { body } from 'express-validator';
import { createPostsValidators } from '../validators/post-validators/create.validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { mongoIdParamValidator } from '../validators/params-validators/mongo-id-param.validator';
import { inputValidationMiddleware } from '../middlewares/input-validation.middleware';
import { bloggerBodyIdValidator } from '../validators/post-validators/blogger-id-validator';
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
postsRouter.post('/', authMiddleware, bloggerBodyIdValidator, createPostsValidators, postHandlers.createPost);

/**
 * Returns one post by ID
 */
postsRouter.get('/:id', getOnePostParamIdValidator, postHandlers.getPostById);

/**
 * Updates one post by ID
 */
postsRouter.put(
	'/:id',
	authMiddleware,
	inputValidationMiddleware,
	getOnePostParamIdValidator,
	bloggerBodyIdValidator,
	inputValidationMiddleware,
	createPostsValidators,
	postHandlers.updatePostById,
);

/**
 * Drops full database
 */
postsRouter.delete('/', authMiddleware, postHandlers.dropCollection);

/**
 * Removes one post by ID
 */
postsRouter.delete('/:id', authMiddleware, getOnePostParamIdValidator, postHandlers.removePostById);
