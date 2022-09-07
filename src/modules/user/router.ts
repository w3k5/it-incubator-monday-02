import { Router } from 'express';
import { userController } from '../../_inversify/inversify.config';
import { paginationValidator } from '../../validators/pagination.validator';
import { sortValidators } from '../../validators/blogger-validators/sort.validator';
import { createUserValidators } from './validators/createUser.validators';
import { basicAuthMiddleware } from '../../middlewares/basicAuth.middleware';

export const userRouter = Router({ caseSensitive: true });

userRouter.get('/', paginationValidator, sortValidators, userController.getAllUsers.bind(userController));

userRouter.post('/', basicAuthMiddleware, createUserValidators, userController.createUser.bind(userController));

userRouter.delete('/:id', basicAuthMiddleware, userController.deleteUserById.bind(userController));
