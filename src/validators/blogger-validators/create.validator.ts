import { body } from 'express-validator';
import { inputValidationMiddleware } from '../../middlewares/input-validation.middleware';
import { nameValidator } from './name-validator';
import { youtubeUrlValidator } from './youtube-url-validator';

export const createBloggerValidators = [
	nameValidator(body('name')),
	youtubeUrlValidator(body('youtubeUrl')),
	inputValidationMiddleware,
];
