import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { EmptyResponse, GetAllEntities, PaginationParams, SortInterface } from '@app/common-types';
import { GetAllDomainResponse, UserOutputInterface } from '@models/user/types/entities';
import {
	CreateUserControllerRequest,
	CreteUserControllerResponse,
	DeleteUserByIdRequest,
	GetAllUserControllerRequest,
	GetAllUsersControllerResponse,
	UserControllerInterface,
} from '@models/user/controllers/controller.types';
import { HttpStatusesEnum, SortDirectionEnum } from '../../../enums';
import { UserServiceInterface } from '../service/service.types';
import { IOC_TYPES } from '../../../inversify/inversify.types';
import { ObjectId } from 'mongodb';

@injectable()
export class UserController implements UserControllerInterface {
	constructor(@inject(IOC_TYPES.UserService) private readonly userService: UserServiceInterface) {}

	/**
	 * Контроллер для роута POST USER
	 * Получает request response
	 * Возвращает созданного пользователя
	 */
	public async createUser({ body }: CreateUserControllerRequest, response: CreteUserControllerResponse) {
		const { login, email, password } = body;
		const user = await this.userService.createUser({ login, email, password });
		return response.send(user);
	}

	/**
	 * Возвращает всех пользователей в соответствии с требованиями из Query
	 */
	async getAllUsers(
		request: GetAllUserControllerRequest,
		response: GetAllUsersControllerResponse,
	): Promise<GetAllUsersControllerResponse> {
		const {
			pageNumber = 1,
			pageSize = 10,
			searchEmailTerm = null,
			searchLoginTerm = null,
			sortBy = 'createdAt',
			sortDirection = SortDirectionEnum.Desc,
		} = request.query;

		const { documents, totalCount, pagesCount }: GetAllDomainResponse = await this.userService.getAllUsers({
			pageSize,
			pageNumber,
			sortBy,
			sortDirection,
			searchLoginTerm,
			searchEmailTerm,
		});

		const result: GetAllEntities<UserOutputInterface> = {
			pageSize,
			page: pageNumber,
			totalCount,
			pagesCount,
			items: documents,
		};
		return response.send(result);
	}

	/**
	 * Контроллер для удаоления пользователя
	 * @param params
	 * @param response
	 * Ничего не возвращает в Payload
	 * При успехе статут NO_CONTENT
	 * Если пользователь не найден NOT_FOUND
	 */
	async deleteUserById({ params }: DeleteUserByIdRequest, response: EmptyResponse): Promise<EmptyResponse> {
		const { id } = params;
		if (!this.checkId(id)) {
			return response.status(HttpStatusesEnum.NOT_FOUND).send();
		}
		const result = await this.userService.deleteUser(id);
		const status = result ? HttpStatusesEnum.NO_CONTENT : HttpStatusesEnum.NOT_FOUND;
		return response.status(status).send();
	}

	private checkId(id: string): boolean {
		return ObjectId.isValid(id);
	}
}
