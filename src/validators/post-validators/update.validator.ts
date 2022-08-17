import { inputValidationMiddleware } from '../../middlewares/input-validation.middleware';
import { body } from 'express-validator';
import { contentValidator } from './content-validator';
import { shortDescriptionValidator } from './youtube-url-validator';
import { titleValidator } from './title-validator';
import { bloggerIdValidator } from './blogger-id-validator';

export const updateBloggerValidators = [
	contentValidator(body('content')).optional({ nullable: true }),
	shortDescriptionValidator(body('shortDescription')).optional({
		nullable: true,
	}),
	titleValidator(body('title')).optional({ nullable: true }),
	bloggerIdValidator(body('bloggerId')).optional({ nullable: true }),
	inputValidationMiddleware,
];
