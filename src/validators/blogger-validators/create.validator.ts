import { body } from 'express-validator';
import { inputValidationMiddleware } from '../../middlewares/input-validation.middleware';
import { nameValidator } from './name-validator';
import { youtubeUrlValidator } from './youtube-url-validator';

export const createBloggerValidators = [
	youtubeUrlValidator(body('youtubeUrl')),
	nameValidator(body('name')),
	inputValidationMiddleware,
];
