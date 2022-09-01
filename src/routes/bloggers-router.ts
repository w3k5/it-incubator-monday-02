import { Router } from 'express';
import { param } from 'express-validator';
import { createBloggerValidators } from '../validators/blogger-validators/create.validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { paginationValidator } from '../validators/pagination.validator';
import { BloggerHandlers } from '../handlers/blogger.handlers';
import { getOneBloggerParamsValidators } from '../validators/blogger-validators/get-one-blogger.validator';
import { updateBloggerValidators } from '../validators/blogger-validators/update.validator';
import { createPostsValidators } from '../validators/post-validators/create.validator';
import { bloggerIdValidator } from '../validators/post-validators/blogger-id-validator';
import { inputValidationMiddleware } from '../middlewares/input-validation.middleware';
import { sortValidators } from '../validators/blogger-validators/sort.validator';

export const bloggersRouter = Router();

const bloggerHandlers = new BloggerHandlers();

/**
 * Returns all bloggers
 */
bloggersRouter.get('/', paginationValidator, sortValidators, bloggerHandlers.getAllBloggers);

/**
 * Get Posts by BloggerId
 */
bloggersRouter.get(
	'/:id/posts',
	getOneBloggerParamsValidators,
	paginationValidator,
	bloggerHandlers.getAllPostBySpecifiedBlogger,
);

/**
 * Create Posts by BloggerId
 */
bloggersRouter.post(
	'/:id/posts',
	authMiddleware,
	bloggerIdValidator(param('id')),
	inputValidationMiddleware,
	createPostsValidators,
	bloggerHandlers.createPostByBloggerId,
);

/**
 * Creates new blogger
 */
bloggersRouter.post('/', authMiddleware, createBloggerValidators, bloggerHandlers.createOneBlogger);

/**
 * Returns one blogger by ID
 */
bloggersRouter.get('/:id', getOneBloggerParamsValidators, bloggerHandlers.getOneBloggerById);

/**
 * Updates one blogger by ID
 */
bloggersRouter.put(
	'/:id',
	authMiddleware,
	getOneBloggerParamsValidators,
	updateBloggerValidators,
	bloggerHandlers.updateOneBloggerById,
);

/**
 * Drops full database
 */
bloggersRouter.delete('/', authMiddleware, bloggerHandlers.dropBloggerCollection);

/**
 * Removes one blogger by ID
 */
bloggersRouter.delete('/:id', authMiddleware, getOneBloggerParamsValidators, bloggerHandlers.removeOneBloggerById);
