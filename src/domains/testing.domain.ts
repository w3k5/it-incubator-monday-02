import { Request, Response } from 'express';
import { bloggersRepository, postsRepository } from '../index';

export class TestingDomain {
	async dropAllCollections(request: Request, response: Response) {
		await bloggersRepository.drop();
		await postsRepository.drop();
		return response.status(204).send();
	}
}
