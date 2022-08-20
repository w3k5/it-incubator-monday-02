import { Request, Response } from 'express';
import { bloggersRepository, postsRepository } from '../index';

export class TestingDomain {
	async dropAllCollections(request: Request, response: Response) {
		try {
			await bloggersRepository.drop();
			await postsRepository.drop();
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
