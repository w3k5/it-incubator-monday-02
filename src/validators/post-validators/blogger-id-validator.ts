import { ValidationChain } from 'express-validator';
import { ObjectId } from 'mongodb';
import { NextFunction, Response } from 'express';
import { HttpStatusesEnum } from '../../enums';
import { blogService } from '../../_inversify/inversify.config';
import { EntityId, RequestWithBody, RequestWithParams } from '../../_common/types';

export const bloggerIdValidator = (chain: ValidationChain): ValidationChain => {
	return chain
		.custom(async (id) => {
			const isIdValid = ObjectId.isValid(id);
			if (!isIdValid) {
				throw new Error('Mongo ID must be valid!');
			}
			return true;
		})
		.custom(async (value: string) => {
			const bloggerCandidate = await blogService.getBlogById(value);
			if (!bloggerCandidate) {
				throw new Error('Blogger is not exists');
			}
			return true;
		});
};

export const bloggerParamIdValidator = async (
	request: RequestWithParams<EntityId>,
	response: Response,
	next: NextFunction,
) => {
	console.log('BLOGGER PARAM ID VALIDATOR');
	const { id } = request.params;
	const isIdValid = ObjectId.isValid(id);
	if (!isIdValid) {
		return response.status(HttpStatusesEnum.NOT_FOUND).send();
	}

	const bloggerCandidate = await blogService.getBlogById(id);
	if (!bloggerCandidate) {
		return response.status(HttpStatusesEnum.NOT_FOUND).send();
	}
	next();
};

export const bloggerBodyIdValidator = async (
	request: RequestWithBody<{ blogId: string }>,
	response: Response,
	next: NextFunction,
) => {
	const { blogId: id } = request.body;
	const isIdValid = ObjectId.isValid(id);
	if (!isIdValid) {
		return response.status(HttpStatusesEnum.NOT_FOUND).send();
	}

	const bloggerCandidate = await blogService.getBlogById(id);
	if (!bloggerCandidate) {
		return response.status(HttpStatusesEnum.NOT_FOUND).send();
	}
	next();
};
