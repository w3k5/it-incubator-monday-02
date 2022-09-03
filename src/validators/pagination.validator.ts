import { query } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares/input-validation.middleware';

const checkPaginationParam = (param: string, defaultValue: number) => {
	return query(param).default(defaultValue).isInt({ min: 1 }).toInt();
};

export const paginationValidator = [
	checkPaginationParam('pageNumber', 1),
	checkPaginationParam('pageSize', 10),
	inputValidationMiddleware,
];
