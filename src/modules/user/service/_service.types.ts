import { UserInputInterface, UserOutputInterface } from '@models/user/types/entities';
import { GetAllUsersQueryParams } from '@models/user/controllers/controller.types';
import { GetAllRepositoryResponse, ModelID } from '../../_base/types';

abstract class AbstractUserService {
	abstract getAllUsers: (params: GetAllUsersQueryParams) => Promise<GetAllRepositoryResponse<UserOutputInterface>>;
	abstract createUser: (dto: UserInputInterface) => Promise<UserOutputInterface>;
	abstract deleteUser: (id: ModelID) => Promise<boolean>;
}

export { AbstractUserService };
