import { GetAllDomainResponse, UserInputInterface, UserOutputInterface } from '@models/user/types/entities';
import { GetAllUsersQueryParams } from '@models/user/controllers/controller.types';

/**
 * Получает DTO для создания пользователя
 * Возвращает полностью готового пользователя
 */
type CreateUser = (dto: UserInputInterface) => Promise<UserOutputInterface>;
type DeleteUser = (id: string) => Promise<boolean>;
type GetAll = (params: GetAllUsersQueryParams) => Promise<GetAllDomainResponse>;

interface UserServiceInterface {
	createUser: CreateUser;
	deleteUser: DeleteUser;
	getAllUsers: GetAll;
}

export { UserServiceInterface };
