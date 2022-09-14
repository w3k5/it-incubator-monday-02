import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IOC_TYPES } from '../_inversify/inversify.types';
import { AbstractUserDatabaseRepository } from '../modules/user/repository/_repository.types';
import { AbstractBlogDatabaseRepository } from '../modules/blogs/types/blogs.repository.types';
import { AbstractPostDatabaseRepository } from '../modules/post/types/post.repository.types';

// TODO: Требуется разобраться с этим модулем, разбить, описать интерфейсы
@injectable()
export class TestingDomain {
	constructor(
		@inject(IOC_TYPES.UserDatabaseRepository) private readonly userRepository: AbstractUserDatabaseRepository,
		@inject(IOC_TYPES.BlogDatabaseRepository) private readonly blogRepository: AbstractBlogDatabaseRepository,
		@inject(IOC_TYPES.PostDatabaseRepository) private readonly postRepository: AbstractPostDatabaseRepository,
	) {}

	async dropAllCollections(request: Request, response: Response) {
		try {
			await this.blogRepository.drop();
			await this.postRepository.drop();
			await this.userRepository.drop();
			return response.status(204).send();
		} catch (error) {
			return response.status(500).send({
				errorsMessages: [
					{
						field: 'null',
						message: `Something went wrong during drop collections, ${error}`,
					},
				],
			});
		}
	}
}
