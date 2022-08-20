import { Router } from 'express';
import { body, query } from 'express-validator';
import { createPostsValidators } from '../validators/post-validators/create.validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { PostsDomain } from '../domains/posts.domain';
import { mongoIdParamValidator } from '../validators/params-validators/mongo-id-param.validator';
import { inputValidationMiddleware } from '../middlewares/input-validation.middleware';
import { bloggerIdValidator } from '../validators/post-validators/blogger-id-validator';
import { paginationValidator } from '../validators/pagination.validator';

export const postsRouter = Router();

export const postsDomain = new PostsDomain();

/**
 * Returns all posts
 * */
postsRouter.get('/', paginationValidator, inputValidationMiddleware, postsDomain.getAll);

/**
 * Creates new post
 */
postsRouter.post('/', authMiddleware, bloggerIdValidator(body('bloggerId')), createPostsValidators, postsDomain.create);

/**
 * Returns one post by ID
 */
postsRouter.get('/:id', mongoIdParamValidator, inputValidationMiddleware, postsDomain.getById);

/**
 * Updates one post by ID
 */
postsRouter.put(
	'/:id',
	authMiddleware,
	mongoIdParamValidator,
	inputValidationMiddleware,
	bloggerIdValidator(body('bloggerId')),
	createPostsValidators,
	postsDomain.updateById,
);

/**
 * Drops full database
 */
postsRouter.delete('/', authMiddleware, postsDomain.dropDatabase);

/**
 * Removes one post by ID
 */
postsRouter.delete('/:id', authMiddleware, mongoIdParamValidator, postsDomain.removeById);
