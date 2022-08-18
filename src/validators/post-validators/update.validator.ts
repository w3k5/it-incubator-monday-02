import { inputValidationMiddleware } from '../../middlewares/input-validation.middleware';
import { body } from 'express-validator';
import { contentValidator } from './content-validator';
import { shortDescriptionValidator } from './youtube-url-validator';
import { titleValidator } from './title-validator';
import { bloggerIdValidator } from './blogger-id-validator';

export const updatePostValidators = [
	contentValidator(body('content')),
	shortDescriptionValidator(body('shortDescription')),
	titleValidator(body('title')),
	bloggerIdValidator(body('bloggerId')),
	inputValidationMiddleware,
];
