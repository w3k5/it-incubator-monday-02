import { query } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares/input-validation.middleware';

export const paginationValidator = [
	query('PageNumber').isInt({ min: 1 }).toInt().optional().default(1),
	query('PageSize').isInt({ min: 1 }).toInt().optional().default(10),
	inputValidationMiddleware,
];
