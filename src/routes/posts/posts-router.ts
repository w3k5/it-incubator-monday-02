import { Router } from 'express';
import {
	createPost,
	dropDatabase,
	getAllPosts,
	getPostById,
	removePostById,
	updatePostById,
} from './handlers';
import { createBloggerValidators } from '../../validators/post-validators/create.validator';
import { authMiddleware } from '../../middlewares/auth.middleware';

export const postsRouter = Router();

/**
 * Returns all videos
 * */
postsRouter.get('/', getAllPosts);

/**
 * Creates new video
 */
postsRouter.post('/', authMiddleware, createBloggerValidators, createPost);

/**
 * Returns one video by ID
 */
postsRouter.get('/:id', getPostById);

/**
 * Updates one video by ID
 */
postsRouter.put(
	'/:id',
	authMiddleware,
	createBloggerValidators,
	updatePostById,
);

/**
 * Drops full database
 */
postsRouter.delete('/', authMiddleware, dropDatabase);

/**
 * Removes one video by ID
 */
postsRouter.delete('/:id', authMiddleware, removePostById);
