import { GetAllPostQueryParams } from './_post.common.types';
import { NextFunction, Response } from 'express';
import { PostInputInterface, PostInputUpdateInterface, PostOutputInterface } from '../entities';
import { ModelID } from '../../_base/types';
import {
	EmptyResponse,
	GetAllEntities,
	RequestWithBody,
	RequestWithBodyAndParams,
	RequestWithParams,
	RequestWithQuery,
} from '../../../_common/types';

// Get All Posts Types
type GetAllPostControllerRequest = RequestWithQuery<GetAllPostQueryParams>;
type GetAllPostControllerResponse = Response<GetAllEntities<PostOutputInterface>>;
type GetAllPostControllerHandler = (
	request: GetAllPostControllerRequest,
	response: GetAllPostControllerResponse,
	next: NextFunction,
) => Promise<GetAllPostControllerResponse>;

// Get One Post Types
type GetPostByIdControllerRequest = RequestWithParams<{ id: ModelID }>;
type GetPostByIdControllerResponse = Response<PostOutputInterface>;
type GetPostByIdControllerHandler = (
	request: GetPostByIdControllerRequest,
	response: GetPostByIdControllerResponse,
	next: NextFunction,
) => Promise<GetPostByIdControllerResponse>;

// Create Post
type CreatePostControllerRequest = RequestWithBody<PostInputInterface>;
type CreatePostControllerResponse = Response<PostOutputInterface>;
type CreatePostControllerHandler = (
	request: CreatePostControllerRequest,
	response: CreatePostControllerResponse,
	next: NextFunction,
) => Promise<CreatePostControllerResponse>;

// Update Post
type UpdatePostControllerRequest = RequestWithBodyAndParams<PostInputUpdateInterface, { id: ModelID }>;
type UpdatePostControllerResponse = EmptyResponse;
type UpdatePostControllerHandler = (
	request: UpdatePostControllerRequest,
	response: UpdatePostControllerResponse,
	next: NextFunction,
) => Promise<UpdatePostControllerResponse>;

// Remove Post
type RemovePostControllerRequest = RequestWithParams<{ id: ModelID }>;
type RemovePostControllerResponse = EmptyResponse;
type RemovePostControllerHandler = (
	request: RemovePostControllerRequest,
	response: RemovePostControllerResponse,
	next: NextFunction,
) => Promise<EmptyResponse>;

abstract class AbstractPostController {
	abstract getAllPosts: GetAllPostControllerHandler;
	abstract getPostById: GetPostByIdControllerHandler;
	abstract createPost: CreatePostControllerHandler;
	abstract updatePostById: UpdatePostControllerHandler;
	abstract deletePostById: RemovePostControllerHandler;
}

export {
	AbstractPostController,
	GetAllPostControllerRequest,
	GetAllPostControllerResponse,
	GetAllPostControllerHandler,
	GetPostByIdControllerRequest,
	GetPostByIdControllerResponse,
	GetPostByIdControllerHandler,
	CreatePostControllerRequest,
	CreatePostControllerResponse,
	CreatePostControllerHandler,
	UpdatePostControllerRequest,
	UpdatePostControllerResponse,
	UpdatePostControllerHandler,
	RemovePostControllerRequest,
	RemovePostControllerResponse,
	RemovePostControllerHandler,
};
