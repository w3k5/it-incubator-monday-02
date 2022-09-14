import { Router } from 'express';
import { postController } from '../../_inversify/inversify.config';
import { paginationValidator } from '../../validators/pagination.validator';
import { basicAuthMiddleware } from '../../middlewares/basicAuth.middleware';
import { bloggerIdValidator } from '../../validators/post-validators/blogger-id-validator';
import { body } from 'express-validator';
import { createPostsValidators } from '../../validators/post-validators/create.validator';
import { inputValidationMiddleware } from '../../middlewares/input-validation.middleware';

export const postRouter = Router({ caseSensitive: true });

/**
 * Returns all posts
 * */
postRouter.get('/', paginationValidator, postController.getAllPosts.bind(postController));

/**
 * Creates new post
 */
postRouter.post(
	'/',
	basicAuthMiddleware,
	bloggerIdValidator(body('blogId')),
	createPostsValidators,
	postController.createPost.bind(postController),
);

/**
 * Returns one post by ID
 */
// TODO: getOnePostParamIdValidator => валидация параметра
postRouter.get('/:id', postController.getPostById.bind(postController));

/**
 * Updates one post by ID
 */
postRouter.put(
	'/:id',
	basicAuthMiddleware,
	inputValidationMiddleware,
	// TODO: getOnePostParamIdValidator => валидация параметра
	bloggerIdValidator(body('blogId')),
	createPostsValidators,
	inputValidationMiddleware,
	postController.updatePostById.bind(postController),
);

/**
 * Removes one post by ID
 */
postRouter.delete(
	'/:id',
	basicAuthMiddleware,
	// TODO: getOnePostParamIdValidator => валидация параметра
	postController.deletePostById.bind(postController),
);
