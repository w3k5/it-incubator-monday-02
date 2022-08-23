import { youtubeUrlValidator } from './youtube-url-validator';
import { body } from 'express-validator';
import { nameValidator } from './name-validator';
import { inputValidationMiddleware } from '../../middlewares/input-validation.middleware';

export const updateBloggerValidators = [
	youtubeUrlValidator(body('youtubeUrl')),
	nameValidator(body('name')),
	inputValidationMiddleware,
];
