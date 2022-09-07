import { CreateUserRepositoryDto } from '@models/user/types/dto/createUserRepositoryDto';
import { UserDatabase } from '@models/user/types/entities';
import { GetAllUsersQueryParams } from '@models/user/controllers/controller.types';
import { ModelID, UserLogin } from '../../_base/types';

export type GetAllRepositoryResponse = { documents: UserDatabase[]; totalCount: number; pagesCount: number };

export abstract class AbstractUserDatabaseRepository {
	/**
	 * Should create new User in Database
	 */
	abstract create: (data: CreateUserRepositoryDto) => Promise<UserDatabase>;
	abstract delete: (id: ModelID) => Promise<boolean>;
	abstract getAll: (params: GetAllUsersQueryParams) => Promise<GetAllRepositoryResponse>;
	abstract getByLogin: (login: UserLogin) => Promise<UserDatabase | null>;
}
