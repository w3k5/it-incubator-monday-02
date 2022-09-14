// import { ObjectId } from 'mongodb';
// import { EntityId, RequestWithBody, RequestWithParams } from '@app/common-types';
// import { NextFunction, Response } from 'express';
// import { HttpStatusesEnum } from '../../enums';
// import { postsDomain } from '../../handlers/post.handlers';
//
// export const postParamIdValidator = async (
// 	request: RequestWithParams<EntityId>,
// 	response: Response,
// 	next: NextFunction,
// ) => {
// 	console.log('POST PARAM ID VALIDATOR');
// 	const { id } = request.params;
// 	const isIdValid = ObjectId.isValid(id);
// 	if (!isIdValid) {
// 		return response.status(HttpStatusesEnum.NOT_FOUND).send();
// 	}
//
// 	const bloggerCandidate = await postsDomain.getById(id);
// 	if (!bloggerCandidate) {
// 		return response.status(HttpStatusesEnum.NOT_FOUND).send();
// 	}
// 	next();
// };
//
// export const postBodyIdValidator = async (
// 	request: RequestWithBody<{ blogId: string }>,
// 	response: Response,
// 	next: NextFunction,
// ) => {
// 	console.log('POST BODY ID VALIDATOR');
// 	const { blogId: id } = request.body;
// 	const isIdValid = ObjectId.isValid(id);
// 	if (!isIdValid) {
// 		return response.status(HttpStatusesEnum.NOT_FOUND).send();
// 	}
//
// 	const bloggerCandidate = await postsDomain.getById(id);
// 	if (!bloggerCandidate) {
// 		return response.status(HttpStatusesEnum.NOT_FOUND).send();
// 	}
// 	next();
// };
//
// export const getOnePostParamIdValidator = [postParamIdValidator];
