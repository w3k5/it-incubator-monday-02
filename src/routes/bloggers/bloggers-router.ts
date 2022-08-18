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
bloggersRouter.post('/', createBloggerValidators, authMiddleware, create);

/**
 * Returns one video by ID
 */
bloggersRouter.get('/:id', getById);

/**
 * Updates one video by ID
 */
bloggersRouter.put('/:id', createBloggerValidators, authMiddleware, updateById);

/**
 * Drops full database
 */
bloggersRouter.delete('/', dropDatabase, authMiddleware);

/**
 * Removes one video by ID
 */
bloggersRouter.delete('/:id', authMiddleware, removeById);
