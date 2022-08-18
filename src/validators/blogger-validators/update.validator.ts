import { inputValidationMiddleware } from '../../middlewares/input-validation.middleware';
import { body } from 'express-validator';
import { nameValidator } from './name-validator';
import { youtubeUrlValidator } from './youtube-url-validator';

export const updateBloggerValidators = [
	nameValidator(body('name')),
	youtubeUrlValidator(body('youtubeUrl')),
	inputValidationMiddleware,
];
