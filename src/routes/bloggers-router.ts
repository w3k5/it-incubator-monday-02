import { Router } from 'express';
import { createBloggerValidators } from '../validators/blogger-validators/create.validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { mongoIdParamValidator } from '../validators/params-validators/mongo-id-param.validator';
import { inputValidationMiddleware } from '../middlewares/input-validation.middleware';
import { BloggerDomain } from '../domains/bloggers.domain';
import { query } from 'express-validator';
import { postsDomain } from './posts-router';
import { createPostsValidators } from '../validators/post-validators/create.validator';

export const bloggersRouter = Router();

export const bloggerDomain = new BloggerDomain();

/**
 * Returns all bloggers
 * */
bloggersRouter.get(
	'/',
	query('PageNumber').isInt({ min: 1 }).toInt().optional().default(1),
	query('PageSize').isInt({ min: 1 }).toInt().optional().default(10),
	query('name').trim().isString().optional().default(null),
	inputValidationMiddleware,
	bloggerDomain.getAll,
);

/**
 * Get Posts by BloggerId
 */

bloggersRouter.get(
	'/:id/posts',
	mongoIdParamValidator,
	inputValidationMiddleware,
	query('PageNumber').isInt({ min: 1 }).toInt().optional().default(1),
	query('PageSize').isInt({ min: 1 }).toInt().optional().default(10),
	postsDomain.getAll,
);

/**
 * Create Posts by BloggerId
 */

bloggersRouter.post(
	'/:id/posts',
	mongoIdParamValidator,
	inputValidationMiddleware,
	createPostsValidators,
	postsDomain.create,
);

/**
 * Creates new blogger
 */
bloggersRouter.post('/', authMiddleware, createBloggerValidators, bloggerDomain.create);

/**
 * Returns one blogger by ID
 */
bloggersRouter.get('/:id', mongoIdParamValidator, inputValidationMiddleware, bloggerDomain.getById);

/**
 * Updates one blogger by ID
 */
bloggersRouter.put('/:id', authMiddleware, mongoIdParamValidator, createBloggerValidators, bloggerDomain.updateById);

/**
 * Drops full database
 */
bloggersRouter.delete('/', authMiddleware, bloggerDomain.dropDatabase);

/**
 * Removes one blogger by ID
 */
bloggersRouter.delete(
	'/:id',
	authMiddleware,
	mongoIdParamValidator,
	inputValidationMiddleware,
	bloggerDomain.removeById,
);
