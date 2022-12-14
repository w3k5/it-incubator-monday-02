import { NextFunction, Response } from 'express';
import { UserInputInterface, UserOutputInterface } from '@models/user/types/entities';
import { ModelID } from '../../_base/types';
import {
	EmptyResponse,
	GetAllEntities,
	PaginationParams,
	RequestWithBody,
	RequestWithParams,
	RequestWithQuery,
	SortInterface,
} from '../../../_common/types';

type CreateUserControllerRequest = RequestWithBody<UserInputInterface>;
type CreateUserControllerResponse = Response<UserOutputInterface>;

type GetAllUsersQueryParams = Partial<
	SortInterface<UserOutputInterface> &
		PaginationParams & {
			searchLoginTerm: string | null;
			searchEmailTerm: string | null;
		}
>;
type GetAllUserControllerRequest = RequestWithQuery<GetAllUsersQueryParams>;
type GetAllUsersControllerResponse = Response<GetAllEntities<UserOutputInterface>>;
type DeleteUserByIdRequest = RequestWithParams<{ id: ModelID }>;

type CreateUserControllerHandler = (
	request: CreateUserControllerRequest,
	response: CreateUserControllerResponse,
	next: NextFunction,
) => Promise<CreateUserControllerResponse>;

type GetAllUsersControllerHandler = (
	request: GetAllUserControllerRequest,
	response: GetAllUsersControllerResponse,
	next: NextFunction,
) => Promise<GetAllUsersControllerResponse>;

type DeleteUserByIdControllerHandler = (
	request: DeleteUserByIdRequest,
	response: EmptyResponse,
	next: NextFunction,
) => Promise<EmptyResponse>;

abstract class AbstractUserController {
	abstract createUser: CreateUserControllerHandler;
	abstract getAllUsers: GetAllUsersControllerHandler;
	abstract deleteUserById: DeleteUserByIdControllerHandler;
}

export {
	CreateUserControllerRequest,
	CreateUserControllerResponse,
	GetAllUsersQueryParams,
	GetAllUserControllerRequest,
	GetAllUsersControllerResponse,
	DeleteUserByIdRequest,
	AbstractUserController,
};
