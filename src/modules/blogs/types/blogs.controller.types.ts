import { NextFunction, Response } from 'express';
import { BlogInputInterface, BlogOutputInterface } from '../entities';
import { GetAllBlogQueryParams } from './_blog.common.types';
import { ModelID } from '../../_base/types';
import { UpdateBlogRepositoryDto } from '../dto/updateBlogRepositoryDto';
import {
	EmptyResponse,
	GetAllEntities,
	RequestWithBody,
	RequestWithBodyAndParams,
	RequestWithParams,
	RequestWithQuery,
} from '../../../_common/types';

// Get All Blogs Types (Request, Response, Method)
type GetAllBlogControllerRequest = RequestWithQuery<GetAllBlogQueryParams>;
type GetAllBlogControllerResponse = Response<GetAllEntities<BlogOutputInterface>>;
type GetAllBlogsControllerHandler = (
	request: GetAllBlogControllerRequest,
	response: GetAllBlogControllerResponse,
	next: NextFunction,
) => Promise<GetAllBlogControllerResponse>;

// Get One Blog by ID (Request, Response, Method)
type GetBlogByIdControllerRequest = RequestWithParams<{ id: ModelID }>;
type GetBlogByIdControllerResponse = Response<BlogOutputInterface>;
type GetBlogByIdControllerHandler = (
	request: GetBlogByIdControllerRequest,
	response: GetBlogByIdControllerResponse,
	next: NextFunction,
) => Promise<GetBlogByIdControllerResponse>;

// Create Blog (Request, Response, Method)
type CreateBlogControllerRequest = RequestWithBody<BlogInputInterface>;
type CreateBlogControllerResponse = Response<BlogOutputInterface>;
type CreateBlogControllerHandler = (
	request: CreateBlogControllerRequest,
	response: CreateBlogControllerResponse,
	next: NextFunction,
) => Promise<CreateBlogControllerResponse>;

// Update Blog (Request, Response, Method)
type UpdateBlogControllerRequest = RequestWithBodyAndParams<UpdateBlogRepositoryDto, { id: ModelID }>;
type UpdateBlogControllerResponse = Response<boolean>;
type UpdateBlogControllerHandler = (
	request: UpdateBlogControllerRequest,
	response: UpdateBlogControllerResponse,
	next: NextFunction,
) => Promise<UpdateBlogControllerResponse>;

// Delete Blog By Id (Request, Response, Method)
type DeleteBlogByIdControllerRequest = RequestWithParams<{ id: ModelID }>;
type DeleteBlogByIdControllerResponse = EmptyResponse;
type DeleteBlogByIdControllerHandler = (
	request: DeleteBlogByIdControllerRequest,
	response: DeleteBlogByIdControllerResponse,
	next: NextFunction,
) => Promise<DeleteBlogByIdControllerResponse>;

abstract class AbstractBlogController {
	abstract getAllBlogs: GetAllBlogsControllerHandler;
	abstract getBlogById: GetBlogByIdControllerHandler;
	abstract createBlog: CreateBlogControllerHandler;
	abstract updateBlog: UpdateBlogControllerHandler;
	abstract deleteBlogById: DeleteBlogByIdControllerHandler;
	// TODO: Работа с Постами через Блог
	// => get posts by blog id
	// => create posts by blog id
}

export {
	AbstractBlogController,
	GetAllBlogControllerRequest,
	GetAllBlogControllerResponse,
	GetAllBlogsControllerHandler,
	GetBlogByIdControllerRequest,
	GetBlogByIdControllerResponse,
	GetBlogByIdControllerHandler,
	CreateBlogControllerRequest,
	CreateBlogControllerResponse,
	CreateBlogControllerHandler,
	UpdateBlogControllerRequest,
	UpdateBlogControllerResponse,
	UpdateBlogControllerHandler,
	DeleteBlogByIdControllerRequest,
	DeleteBlogByIdControllerResponse,
	DeleteBlogByIdControllerHandler,
};
