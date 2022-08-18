import { inputValidationMiddleware } from '../../middlewares/input-validation.middleware';
import { body } from 'express-validator';
import { nameValidator } from './name-validator';
import { youtubeUrlValidator } from './youtube-url-validator';

export const updateBloggerValidators = [
	youtubeUrlValidator(body('youtubeUrl')),
	nameValidator(body('name')),
	inputValidationMiddleware,
];
