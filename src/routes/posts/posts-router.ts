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
import { updatePostValidators } from '../../validators/post-validators/update.validator';

export const postsRouter = Router();

/**
 * Returns all videos
 * */
postsRouter.get('/', getAllPosts);

/**
 * Creates new video
 */
postsRouter.post('/', createBloggerValidators, createPost);

/**
 * Returns one video by ID
 */
postsRouter.get('/:id', getPostById);

/**
 * Updates one video by ID
 */
postsRouter.put('/:id', updatePostValidators, updatePostById);

/**
 * Drops full database
 */
postsRouter.delete('/', dropDatabase);

/**
 * Removes one video by ID
 */
postsRouter.delete('/:id', removePostById);