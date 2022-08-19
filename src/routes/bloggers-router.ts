import { Router } from 'express';
import { createBloggerValidators } from '../validators/blogger-validators/create.validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { mongoIdParamValidator } from '../validators/params-validators/mongo-id-param.validator';
import { inputValidationMiddleware } from '../middlewares/input-validation.middleware';
import { BloggerDomain } from '../domains/bloggers.domain';

export const bloggersRouter = Router();

const bloggerDomain = new BloggerDomain();

/**
 * Returns all videos
 * */
bloggersRouter.get('/', bloggerDomain.get);

/**
 * Creates new video
 */
bloggersRouter.post('/', authMiddleware, createBloggerValidators, bloggerDomain.create);

/**
 * Returns one video by ID
 */
bloggersRouter.get('/:id', mongoIdParamValidator, inputValidationMiddleware, bloggerDomain.getById);

/**
 * Updates one video by ID
 */
bloggersRouter.put('/:id', authMiddleware, mongoIdParamValidator, createBloggerValidators, bloggerDomain.updateById);

/**
 * Drops full database
 */
bloggersRouter.delete('/', authMiddleware, bloggerDomain.dropDatabase);

/**
 * Removes one video by ID
 */
bloggersRouter.delete(
	'/:id',
	authMiddleware,
	mongoIdParamValidator,
	inputValidationMiddleware,
	bloggerDomain.removeById,
);
