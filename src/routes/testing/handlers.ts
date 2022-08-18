import { NextFunction, Request, Response } from 'express';
import { bloggersRepository, postsRepository } from '../../index';

export const dropAllCollections = async (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	await bloggersRepository.drop();
	await postsRepository.drop();
	return response.status(204).send();
};
