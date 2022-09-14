import { Router } from 'express';
import { blogController } from '../../_inversify/inversify.config';
import { paginationValidator } from '../../validators/pagination.validator';
import { sortValidators } from '../../validators/blogger-validators/sort.validator';
import { basicAuthMiddleware } from '../../middlewares/basicAuth.middleware';
import { createBloggerValidators } from '../../validators/blogger-validators/create.validator';
import { getOneBloggerParamsValidators } from '../../validators/blogger-validators/get-one-blogger.validator';
import { updateBloggerValidators } from '../../validators/blogger-validators/update.validator';
import { param } from 'express-validator';
import { ObjectId } from 'mongodb';

export const blogsRouter = Router({ caseSensitive: true });

blogsRouter.get('/', paginationValidator, sortValidators, blogController.getAllBlogs.bind(blogController));

/**
 * Creates new blogger
 */
blogsRouter.post('/', basicAuthMiddleware, createBloggerValidators, blogController.createBlog.bind(blogController));

/**
 * Returns one blogger by ID
 */
blogsRouter.get('/:id', getOneBloggerParamsValidators, blogController.getBlogById.bind(blogController));

/**
 * Updates one blogger by ID
 */
blogsRouter.put(
	'/:id',
	basicAuthMiddleware,
	getOneBloggerParamsValidators,
	updateBloggerValidators,
	blogController.updateBlog.bind(blogController),
);

/**
 * Removes one blogger by ID
 */
blogsRouter.delete(
	'/:id',
	basicAuthMiddleware,
	getOneBloggerParamsValidators,
	blogController.deleteBlogById.bind(blogController),
);

/**
 * Get Posts by BloggerId
 */
blogsRouter.get(
	'/:blogId/posts',
	param('blogId').exists().isMongoId(),
	paginationValidator,
	blogController.getPostsByBlogId.bind(blogController),
);
//
// /**
//  * Create Posts by BloggerId
//  * @deprecated
//  */
// bloggersRouter.post(
// 	'/:id/posts',
// 	basicAuthMiddleware,
// 	bloggerParamIdValidator,
// 	inputValidationMiddleware,
// 	createPostsValidators,
// 	bloggerHandlers.createPostByBloggerId,
// );
