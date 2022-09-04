import { CreateUserRepositoryDto } from '@models/user/types/dto/createUserRepositoryDto';
import { UserDatabase } from '@models/user/types/entities';
import { GetAllUsersQueryParams } from '@models/user/controllers/controller.types';

export type GetAllRepositoryResponse = { documents: UserDatabase[]; totalCount: number; pagesCount: number };

export type UserDatabaseRepositoryType = {
	create: (data: CreateUserRepositoryDto) => Promise<UserDatabase>;
	delete: (id: string) => Promise<boolean>;
	getAll: (params: GetAllUsersQueryParams) => Promise<GetAllRepositoryResponse>;
};
