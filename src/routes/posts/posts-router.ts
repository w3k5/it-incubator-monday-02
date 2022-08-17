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

export const postsRouter = Router();

/**
 * Returns all videos
 * */
postsRouter.get('/', getAllPosts);

/**
 * Creates new video
 */
postsRouter.post(
	'/',

	createBloggerValidators,
	createPost,
);

/**
 * Returns one video by ID
 */
postsRouter.get('/:id', getPostById);

/**
 * Updates one video by ID
 */
postsRouter.put('/:id', updatePostById);

/**
 * Drops full database
 */
postsRouter.delete('/', dropDatabase);

/**
 * Removes one video by ID
 */
postsRouter.delete('/:id', removePostById);
