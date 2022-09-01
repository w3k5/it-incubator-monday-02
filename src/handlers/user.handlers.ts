import { NextFunction, Response } from 'express';
import {
	EmptyResponse,
	EntityId,
	GetAllEntities,
	RequestWithBody,
	RequestWithParams,
	RequestWithQuery,
} from '@app/common-types';
import { HttpStatusesEnum } from '../enums';
import { GetAllUsersParams } from '../dto/user/get-all-users.dto';
import { UserResponseType } from '../entities';
import { UserDomain } from '../domains/user.domain';
import { CreateUserDto } from '../dto/user/create-user.dto';

export const usersDomain = new UserDomain();

export class UserHandlers {
	async getAllUsers(
		request: RequestWithQuery<GetAllUsersParams>,
		response: Response<GetAllEntities<UserResponseType>>,
		next: NextFunction,
	) {
		try {
			const { PageNumber, PageSize } = request.query;
			const result: GetAllEntities<UserResponseType> = await usersDomain.getAllUsers(PageNumber, PageSize);
			return response.status(HttpStatusesEnum.OK).send(result);
		} catch (error: any) {
			next({
				status: 500,
				message: 'Internal server error',
				error: error.message || 'something went wrong',
				route: 'users',
				endpoint: 'get all',
			});
		}
	}

	async createUser(request: RequestWithBody<CreateUserDto>, response: Response<UserResponseType>, next: NextFunction) {
		try {
			const { login, password } = request.body;
			const user = await usersDomain.createUser({ login, password });
			return response.status(HttpStatusesEnum.CREATED).send(user);
		} catch (error: any) {
			next({
				status: 500,
				message: 'Internal server error',
				error: error.message || 'something went wrong',
				route: 'users',
				endpoint: 'create user',
			});
		}
	}

	async deleteUser(request: RequestWithParams<EntityId>, response: EmptyResponse, next: NextFunction) {
		try {
			const { id } = request.params;
			const result = await usersDomain.deleteUserById(id);
			const status = result ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND;
			return response.status(status).send();
		} catch (error: any) {
			next({
				status: 500,
				message: 'Internal server error',
				error: error.message || 'something went wrong',
				route: 'users',
				endpoint: 'delete by id',
			});
		}
	}
}
