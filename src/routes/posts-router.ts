import { Router } from 'express';
import { createBloggerValidators } from '../validators/post-validators/create.validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { PostsDomain } from '../domains/posts.domain';
import { mongoIdParamValidator } from '../validators/params-validators/mongo-id-param.validator';
import { inputValidationMiddleware } from '../middlewares/input-validation.middleware';

export const postsRouter = Router();

const postsDomain = new PostsDomain();

/**
 * Returns all videos
 * */
postsRouter.get('/', postsDomain.get);

/**
 * Creates new video
 */
postsRouter.post('/', authMiddleware, createBloggerValidators, postsDomain.create);

/**
 * Returns one video by ID
 */
postsRouter.get('/:id', mongoIdParamValidator, inputValidationMiddleware, postsDomain.getById);

/**
 * Updates one video by ID
 */
postsRouter.put(
	'/:id',
	authMiddleware,
	mongoIdParamValidator,
	inputValidationMiddleware,
	createBloggerValidators,
	postsDomain.updateById,
);

/**
 * Drops full database
 */
postsRouter.delete('/', authMiddleware, postsDomain.dropDatabase);

/**
 * Removes one video by ID
 */
postsRouter.delete('/:id', authMiddleware, mongoIdParamValidator, postsDomain.removeById);
