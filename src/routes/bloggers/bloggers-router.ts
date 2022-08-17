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
import { updateBloggerValidators } from '../../validators/blogger-validators/update.validator';

export const bloggersRouter = Router();

/**
 * Returns all videos
 * */
bloggersRouter.get('/', get);

/**
 * Creates new video
 */
bloggersRouter.post('/', createBloggerValidators, create);

/**
 * Returns one video by ID
 */
bloggersRouter.get('/:id', getById);

/**
 * Updates one video by ID
 */
bloggersRouter.put('/:id', updateBloggerValidators, updateById);

/**
 * Drops full database
 */
bloggersRouter.delete('/', dropDatabase);

/**
 * Removes one video by ID
 */
bloggersRouter.delete('/:id', removeById);
