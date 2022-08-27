import { body } from 'express-validator';
import { inputValidationMiddleware } from '../../middlewares/input-validation.middleware';
import { contentValidator } from './content-validator';
import { shortDescriptionValidator } from './youtube-url-validator';
import { titleValidator } from './title-validator';
import { bloggerIdValidator } from './blogger-id-validator';

export const createPostsValidators = [
	bloggerIdValidator(body('bloggerId')),
	contentValidator(body('content')),
	shortDescriptionValidator(body('shortDescription')),
	titleValidator(body('title')),
	inputValidationMiddleware,
];
