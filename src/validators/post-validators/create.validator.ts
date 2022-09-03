import { body } from 'express-validator';
import { inputValidationMiddleware } from '../../middlewares/input-validation.middleware';
import { contentValidator } from './content-validator';
import { shortDescriptionValidator } from './youtube-url-validator';
import { titleValidator } from './title-validator';

export const createPostsValidators = [
	contentValidator(body('content')),
	shortDescriptionValidator(body('shortDescription')),
	titleValidator(body('title')),
	inputValidationMiddleware,
];
