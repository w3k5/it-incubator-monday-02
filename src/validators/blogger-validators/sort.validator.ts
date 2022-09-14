import { query } from 'express-validator';
import { SortDirectionEnum } from '../../enums';
import { inputValidationMiddleware } from '../../middlewares/input-validation.middleware';

export const sortValidators = [
	query('sortBy').default('createdAt').trim().isString(),
	query('sortDirection')
		.default(SortDirectionEnum.desc)
		.custom((sortValue) => {
			if (sortValue in SortDirectionEnum) {
				return true;
			}
			throw new Error('Sort Direction must be Asc or Desc');
		}),
	inputValidationMiddleware,
];
