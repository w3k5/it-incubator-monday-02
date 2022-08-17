import { inputValidationMiddleware } from '../../middlewares/input-validation.middleware';
import { body } from 'express-validator';
import { nameValidator } from './content-validator';
import { youtubeUrlValidator } from './youtube-url-validator';

export const updateBloggerValidators = [
	nameValidator(body('name')).optional({ nullable: true }),
	youtubeUrlValidator(body('youtubeUrl')).optional({ nullable: true }),
	inputValidationMiddleware,
];
