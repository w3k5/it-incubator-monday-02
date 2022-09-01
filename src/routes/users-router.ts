import { Router } from 'express';
import { UserHandlers } from '../handlers/user.handlers';
import { paginationValidator } from '../validators/pagination.validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { mongoIdParamValidator } from '../validators/params-validators/mongo-id-param.validator';
import { inputValidationMiddleware } from '../middlewares/input-validation.middleware';

export const usersRouter = Router();
const userHandlers = new UserHandlers();

usersRouter.get('/', paginationValidator, userHandlers.getAllUsers);

usersRouter.post('/', authMiddleware, userHandlers.createUser);

usersRouter.delete('/:id', authMiddleware, mongoIdParamValidator, inputValidationMiddleware, userHandlers.deleteUser);
