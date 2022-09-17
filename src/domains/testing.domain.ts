import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IOC_TYPES, REPOSITORIES_TYPES, SERVICES_TYPES } from '../_inversify/inversify.types';
import { AbstractUserDatabaseRepository } from '../modules/user/repository/_repository.types';
import { AbstractBlogDatabaseRepository } from '../modules/blogs/types/blogs.repository.types';
import { AbstractPostDatabaseRepository } from '../modules/post/types/post.repository.types';
import { AbstractCommentsRepository } from '../modules/comments/types/comments.repository.abstract';
import { AbstractActivationRepositoryCommand } from '../modules/activation/types/activation.repository.command.abstract';

// TODO: Требуется разобраться с этим модулем, разбить, описать интерфейсы
@injectable()
export class TestingDomain {
	constructor(
		@inject(IOC_TYPES.UserDatabaseRepository) private readonly userRepository: AbstractUserDatabaseRepository,
		@inject(IOC_TYPES.BlogDatabaseRepository) private readonly blogRepository: AbstractBlogDatabaseRepository,
		@inject(IOC_TYPES.PostDatabaseRepository) private readonly postRepository: AbstractPostDatabaseRepository,
		@inject(REPOSITORIES_TYPES.CommentsCommandRepository)
		private readonly commentsRepository: AbstractCommentsRepository,
		@inject(REPOSITORIES_TYPES.ActivationCommandRepository)
		private readonly activationRepository: AbstractActivationRepositoryCommand,
	) {}

	async dropAllCollections(request: Request, response: Response) {
		try {
			await this.blogRepository.drop();
			await this.postRepository.drop();
			await this.userRepository.drop();
			await this.commentsRepository.drop();
			await this.activationRepository.drop();
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
