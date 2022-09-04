import { NextFunction, Router } from 'express';
import 'reflect-metadata';
import { iocContainer } from '../../inversify/inversify.config';
import { IOC_TYPES } from '../../inversify/inversify.types';
import {
	CreateUserControllerRequest,
	CreteUserControllerResponse,
	DeleteUserByIdRequest,
	GetAllUserControllerRequest,
	GetAllUsersControllerResponse,
	UserControllerInterface,
} from './controllers/controller.types';
import { EmptyResponse } from '@app/common-types';
import { paginationValidator } from '../../validators/pagination.validator';
import { sortValidators } from '../../validators/blogger-validators/sort.validator';
import { createUserValidators } from './validators/createUser.validators';
import { authMiddleware } from '../../middlewares/auth.middleware';

const userController = iocContainer.get<UserControllerInterface>(IOC_TYPES.UserController);

export const userRouter = Router({ caseSensitive: true });

userRouter.get(
	'/',
	paginationValidator,
	sortValidators,
	async (request: GetAllUserControllerRequest, response: GetAllUsersControllerResponse, next: NextFunction) => {
		try {
			await userController.getAllUsers(request, response, next);
		} catch (error: any) {
			next({
				status: 500,
				message: 'Internal server error',
				error: error.message || 'something went wrong',
				route: 'users',
				endpoint: 'get all',
			});
		}
	},
);

userRouter.post(
	'/',
	authMiddleware,
	createUserValidators,
	async (request: CreateUserControllerRequest, response: CreteUserControllerResponse, next: NextFunction) => {
		try {
			await userController.createUser(request, response, next);
		} catch (error: any) {
			next({
				status: 500,
				message: 'Internal server error',
				error: error.message || 'something went wrong',
				route: 'users',
				endpoint: 'create',
			});
		}
	},
);

userRouter.delete('/:id', authMiddleware, async (request: DeleteUserByIdRequest, response: EmptyResponse, next) => {
	try {
		await userController.deleteUserById(request, response, next);
	} catch (error: any) {
		next({
			status: 500,
			message: 'Internal server error',
			error: error.message || 'something went wrong',
			route: 'users',
			endpoint: 'delete',
		});
	}
});
