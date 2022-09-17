import { UserDatabase, UserInputInterface, UserOutputInterface } from '@models/user/types/entities';
import { GetAllUsersQueryParams } from '@models/user/controllers/controller.types';
import { GetAllRepositoryResponse, ModelID } from '../../_base/types';
import { RegisterBodyDto } from '../../auth/dto/registerBody.dto';

abstract class AbstractUserService {
	abstract getAllUsers: (params: GetAllUsersQueryParams) => Promise<GetAllRepositoryResponse<UserOutputInterface>>;
	/**
	 * @deprecated
	 */
	abstract createUser: (dto: UserInputInterface) => Promise<UserOutputInterface>;
	abstract createUserV2: (dto: RegisterBodyDto) => Promise<UserDatabase>;
	abstract deleteUser: (id: ModelID) => Promise<boolean>;
	abstract drop: () => Promise<void>;
}

export { AbstractUserService };
