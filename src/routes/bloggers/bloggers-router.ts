import { Router } from 'express';
import {
	create,
	dropDatabase,
	get,
	getById,
	removeById,
	updateById,
} from './handlers';
import { createBloggerValidators } from '../../validators/blogger-validators/create.validator';
import { authMiddleware } from '../../middlewares/auth.middleware';

export const bloggersRouter = Router();

/**
 * Returns all videos
 * */
bloggersRouter.get('/', get);

/**
 * Creates new video
 */
bloggersRouter.post('/', authMiddleware, createBloggerValidators, create);

/**
 * Returns one video by ID
 */
bloggersRouter.get('/:id', getById);

/**
 * Updates one video by ID
 */
bloggersRouter.put('/:id', authMiddleware, createBloggerValidators, updateById);

/**
 * Drops full database
 */
bloggersRouter.delete('/', authMiddleware, dropDatabase);

/**
 * Removes one video by ID
 */
bloggersRouter.delete('/:id', authMiddleware, removeById);
