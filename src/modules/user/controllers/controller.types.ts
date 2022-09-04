import { NextFunction, Response } from 'express';
import {
	EmptyResponse,
	GetAllEntities,
	PaginationParams,
	RequestWithBody,
	RequestWithParams,
	RequestWithQuery,
	SortInterface,
} from '@app/common-types';
import { UserInputInterface, UserOutputInterface } from '@models/user/types/entities';
import { ModelID } from '@models/user/types/primitives';

type CreateUserControllerRequest = RequestWithBody<UserInputInterface>;
type CreteUserControllerResponse = Response<UserOutputInterface>;

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
	response: CreteUserControllerResponse,
	next: NextFunction,
) => Promise<CreteUserControllerResponse>;

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

interface UserControllerInterface {
	createUser: CreateUserControllerHandler;
	getAllUsers: GetAllUsersControllerHandler;
	deleteUserById: DeleteUserByIdControllerHandler;
}

export {
	CreateUserControllerRequest,
	CreteUserControllerResponse,
	GetAllUsersQueryParams,
	GetAllUserControllerRequest,
	GetAllUsersControllerResponse,
	DeleteUserByIdRequest,
	UserControllerInterface,
};
