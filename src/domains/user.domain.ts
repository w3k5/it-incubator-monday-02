import { GetAllEntities } from '@app/common-types';
import { UserResponseType } from '../entities';
import { countTotalPages, paginationBuilder } from '../helpers/pagination-builder';
import { usersRepository } from '../index';
import { CreateUserDto } from '../dto/user/create-user.dto';

export class UserDomain {
	async getAllUsers(pageNumber: number, pageSize: number): Promise<GetAllEntities<UserResponseType>> {
		const { skip } = paginationBuilder({ pageNumber, pageSize });
		const repositorySearchParams = {
			pageNumber,
			pageSize,
			skip,
		};

		const users = await usersRepository.getAll(repositorySearchParams);
		const total: number = await usersRepository.countAllDocuments();
		const pagesCount: number = countTotalPages(total, pageSize);
		return {
			pagesCount,
			page: pageNumber,
			pageSize,
			totalCount: total,
			items: users,
		};
	}

	async createUser(createUserDto: CreateUserDto) {
		const newUser = await usersRepository.create(createUserDto);
		return newUser;
	}

	async deleteUserById(id: string) {
		return await usersRepository.removeById(id);
	}
}
