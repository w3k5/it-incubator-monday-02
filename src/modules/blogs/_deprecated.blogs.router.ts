import { Router } from 'express';
import { blogController } from '../../_inversify/inversify.config';
import { paginationValidator } from '../../validators/pagination.validator';
import { sortValidators } from '../../validators/blogger-validators/sort.validator';
import { basicAuthMiddleware } from '../../middlewares/basicAuth.middleware';
import { createBloggerValidators } from '../../validators/blogger-validators/create.validator';
// import { getOneBloggerParamsValidators } from '../../validators/blogger-validators/get-one-blogger.validator';
import { updateBloggerValidators } from '../../validators/blogger-validators/update.validator';
import { param } from 'express-validator';
import { createPostsValidators } from '../../validators/post-validators/create.validator';
import { inputValidationMiddleware } from '../../middlewares/input-validation.middleware';

export const _deprecatedBlogsRouter = Router({ caseSensitive: true });

_deprecatedBlogsRouter.get('/', paginationValidator, sortValidators, blogController.getAllBlogs.bind(blogController));

/**
 * Creates new blogger
 */
_deprecatedBlogsRouter.post(
	'/',
	basicAuthMiddleware,
	createBloggerValidators,
	blogController.createBlog.bind(blogController),
);

/**
 * Returns one blogger by ID
 */
_deprecatedBlogsRouter.get('/:id', param('id').exists().isMongoId(), blogController.getBlogById.bind(blogController));

/**
 * Updates one blogger by ID
 */
_deprecatedBlogsRouter.put(
	'/:id',
	basicAuthMiddleware,
	param('id').exists().isMongoId(),
	updateBloggerValidators,
	blogController.updateBlog.bind(blogController),
);

/**
 * Removes one blogger by ID
 */
_deprecatedBlogsRouter.delete(
	'/:id',
	basicAuthMiddleware,
	param('id').exists().isMongoId(),
	blogController.deleteBlogById.bind(blogController),
);

/**
 * Get Posts by BloggerId
 */
_deprecatedBlogsRouter.get(
	'/:blogId/posts',
	param('blogId').exists().isMongoId(),
	paginationValidator,
	blogController.getPostsByBlogId.bind(blogController),
);

/**
 * Create Posts by BloggerId
 */
_deprecatedBlogsRouter.post(
	'/:blogId/posts',
	basicAuthMiddleware,
	param('blogId').exists().isMongoId(),
	inputValidationMiddleware,
	createPostsValidators,
	blogController.createPostByBlogId.bind(blogController),
);
