import { CreateUserRepositoryDto } from '@models/user/types/dto/createUserRepositoryDto';
import { UserDatabase } from '@models/user/types/entities';
import { GetAllUsersQueryParams } from '@models/user/controllers/controller.types';
import { GetAllRepositoryResponse, ModelID, UserEmail, UserLogin } from '../../_base/types';
import { AbstractBaseRepository } from '../../_base/abstractBaseRepository';
import { Nullable } from '../../../_common/types';

export abstract class AbstractUserDatabaseRepository implements AbstractBaseRepository {
	abstract drop: () => Promise<void>;
	abstract create: (data: CreateUserRepositoryDto) => Promise<UserDatabase>;
	abstract delete: (id: ModelID) => Promise<boolean>;
	abstract getAll: (params: GetAllUsersQueryParams) => Promise<GetAllRepositoryResponse<UserDatabase>>;
	abstract getByLogin: (login: UserLogin) => Promise<Nullable<UserDatabase>>;
	abstract getByLoginOrEmail: (login: UserLogin, email: UserEmail) => Promise<Nullable<UserDatabase>>;
}
