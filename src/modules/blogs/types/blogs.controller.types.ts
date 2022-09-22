import { NextFunction, Response } from 'express';
import { BlogInputInterface, BlogOutputInterface } from '../entities';
import { GetAllBlogQueryParams } from './_blog.common.types';
import { ModelID } from '../../_base/types';
import { _deprecatedUpdateBlogRepositoryDto } from '../dto/_deprecated.updateBlogRepositoryDto';
import {
	EmptyResponse,
	GetAllEntities,
	RequestWithBody,
	RequestWithBodyAndParams,
	RequestWithParams,
	RequestWithParamsAndQuery,
	RequestWithQuery,
} from '../../../_common/types';
import { GetAllPostQueryParams } from '../../post/types/_post.common.types';
import { PostInputInterface, PostOutputInterface } from '../../post/entities';
import request from 'supertest';

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
type UpdateBlogControllerRequest = RequestWithBodyAndParams<_deprecatedUpdateBlogRepositoryDto, { id: ModelID }>;
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

// Get Posts By Specified BlogID
type GetPostsByBlogIdControllerRequest = RequestWithParamsAndQuery<{ blogId: ModelID }, GetAllPostQueryParams>;
type GetPostsByBlogIdControllerResponse = Response<GetAllEntities<PostOutputInterface>>;
type GetPostsByBlogIdControllerHandler = (
	request: GetPostsByBlogIdControllerRequest,
	response: GetPostsByBlogIdControllerResponse,
	next: NextFunction,
) => Promise<GetPostsByBlogIdControllerResponse>;

// Create Post By Specified BlogId

type CreatePostByBlogIdControllerRequest = RequestWithBodyAndParams<
	Omit<PostInputInterface, 'blogId'>,
	{ blogId: ModelID }
>;
type CreatePostByBlogIdControllerResponse = Response<PostOutputInterface>;
type CreatePostByBlogIdControllerHandler = (
	request: CreatePostByBlogIdControllerRequest,
	response: CreatePostByBlogIdControllerResponse,
	next: NextFunction,
) => Promise<CreatePostByBlogIdControllerResponse>;

abstract class AbstractBlogController {
	abstract getAllBlogs: GetAllBlogsControllerHandler;
	abstract getBlogById: GetBlogByIdControllerHandler;
	abstract createBlog: CreateBlogControllerHandler;
	abstract updateBlog: UpdateBlogControllerHandler;
	abstract deleteBlogById: DeleteBlogByIdControllerHandler;
	abstract getPostsByBlogId: GetPostsByBlogIdControllerHandler;
	abstract createPostByBlogId: CreatePostByBlogIdControllerHandler;
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
	GetPostsByBlogIdControllerRequest,
	GetPostsByBlogIdControllerResponse,
	GetPostsByBlogIdControllerHandler,
	CreatePostByBlogIdControllerRequest,
	CreatePostByBlogIdControllerResponse,
	CreatePostByBlogIdControllerHandler,
};
