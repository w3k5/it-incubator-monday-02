import 'reflect-metadata';
import { Container } from 'inversify';
import { IOC_TYPES, MIDDLEWARES_TYPES, REPOSITORIES_TYPES, SERVICES_TYPES } from './inversify.types';
import {
	AbstractAuthController,
	AbstractAuthService,
	AbstractBlogController,
	AbstractBlogService,
	AbstractTokenService,
	AbstractUserDatabaseRepository,
	AuthController,
	AuthService,
	BlogsController,
	BlogsService,
	DateService,
	DateServiceInterface,
	PasswordService,
	PasswordServiceInterface,
	TestingDomain,
	AbstractBlogDatabaseRepository,
	BlogsDatabaseRepository,
	TokenService,
	UserController,
	AbstractUserController,
	UserDatabaseRepository,
	UserService,
	AbstractUserService,
	AbstractPostDatabaseRepository,
	PostService,
	AbstractPostService,
	PostDatabaseRepository,
	ErrorBoundaryService,
	AbstractErrorBoundaryService,
} from './imports';
import { AbstractPostController } from '../modules/post/types/post.controller.types';
import { PostController } from '../modules/post/post.controller';
import { AuthBearerMiddleware } from '../modules/auth/middlewares/auth.bearer.middleware';
import { AbstractCommentsQueryRepository } from '../modules/comments/types/comments.repository.query.abstract';
import { CommentsQueryRepository } from '../modules/comments/comments.repository.query';
import { AbstractPostRepositoryQueryTypes } from '../modules/post/types/post.repository.query.types';
import { PostRepositoryQuery } from '../modules/post/post.repository.query';
import { AbstractCommentsRepository } from '../modules/comments/types/comments.repository.abstract';
import { CommentsRepository } from '../modules/comments/comments.repository';
import { AbstractCommentsService } from '../modules/comments/types/comments.service.abstract';
import { CommentsService } from '../modules/comments/comments.service';

const iocContainer = new Container();

/*	================================ Global Services ===================================== */
iocContainer.bind<PasswordServiceInterface>(IOC_TYPES.PasswordService).to(PasswordService).inSingletonScope();
iocContainer.bind<DateServiceInterface>(IOC_TYPES.DateService).to(DateService).inSingletonScope();
iocContainer.bind<AbstractTokenService>(IOC_TYPES.TokenService).to(TokenService).inSingletonScope();
iocContainer
	.bind<AbstractErrorBoundaryService>(IOC_TYPES.ErrorBoundaryService)
	.to(ErrorBoundaryService)
	.inSingletonScope();

const passwordService = iocContainer.get<PasswordServiceInterface>(IOC_TYPES.PasswordService);
const tokenService = iocContainer.get<AbstractTokenService>(IOC_TYPES.TokenService);
/*	====================================================================================== */

/*	================================== User Services ===================================== */
iocContainer.bind<AbstractUserService>(IOC_TYPES.UserService).to(UserService).inSingletonScope();
iocContainer.bind<AbstractUserController>(IOC_TYPES.UserController).to(UserController).inSingletonScope();
iocContainer
	.bind<AbstractUserDatabaseRepository>(IOC_TYPES.UserDatabaseRepository)
	.to(UserDatabaseRepository)
	.inSingletonScope();

const userService = iocContainer.get<AbstractUserService>(IOC_TYPES.UserService);
const userController = iocContainer.get<AbstractUserController>(IOC_TYPES.UserController);
/*	====================================================================================== */

/*	================================== Auth Services ===================================== */
iocContainer.bind<AbstractAuthController>(IOC_TYPES.AuthController).to(AuthController).inSingletonScope();
iocContainer.bind<AbstractAuthService>(IOC_TYPES.AuthService).to(AuthService).inSingletonScope();

const authController = iocContainer.get<AbstractAuthController>(IOC_TYPES.AuthController);
const authService = iocContainer.get<AbstractAuthService>(IOC_TYPES.AuthService);
/*	====================================================================================== */

/*	================================== Blog Services ===================================== */
iocContainer
	.bind<AbstractBlogDatabaseRepository>(IOC_TYPES.BlogDatabaseRepository)
	.to(BlogsDatabaseRepository)
	.inSingletonScope();
iocContainer.bind<AbstractBlogService>(IOC_TYPES.BlogService).to(BlogsService).inSingletonScope();
iocContainer.bind<AbstractBlogController>(IOC_TYPES.BlogController).to(BlogsController).inSingletonScope();

const blogController = iocContainer.get<AbstractBlogController>(IOC_TYPES.BlogController);
const blogService = iocContainer.get<AbstractBlogService>(IOC_TYPES.BlogService);
/*	====================================================================================== */

/*	================================== Post Services ===================================== */
iocContainer.bind<AbstractPostService>(IOC_TYPES.PostService).to(PostService).inSingletonScope();
iocContainer
	.bind<AbstractPostDatabaseRepository>(IOC_TYPES.PostDatabaseRepository)
	.to(PostDatabaseRepository)
	.inSingletonScope();
iocContainer
	.bind<AbstractPostRepositoryQueryTypes>(REPOSITORIES_TYPES.PostQueryRepository)
	.to(PostRepositoryQuery)
	.inSingletonScope();
iocContainer.bind<AbstractPostController>(IOC_TYPES.PostController).to(PostController).inSingletonScope();

const postService = iocContainer.get<AbstractPostService>(IOC_TYPES.PostService);
const postController = iocContainer.get<AbstractPostController>(IOC_TYPES.PostController);
/*	====================================================================================== */

/*	================================ Comments Services =================================== */
iocContainer
	.bind<AbstractCommentsQueryRepository>(REPOSITORIES_TYPES.CommentsQueryRepository)
	.to(CommentsQueryRepository)
	.inSingletonScope();
iocContainer
	.bind<AbstractCommentsRepository>(REPOSITORIES_TYPES.CommentsCommandRepository)
	.to(CommentsRepository)
	.inSingletonScope();
iocContainer.bind<AbstractCommentsService>(SERVICES_TYPES.CommentsService).to(CommentsService).inSingletonScope();
/*	====================================================================================== */

// TODO: Требуется разобраться с этим модулем, разбить, описать интерфейсы
/*	================================ Testing Services ===================================== */
iocContainer.bind(IOC_TYPES.TestingService).to(TestingDomain).inSingletonScope();

const testingService = iocContainer.get(IOC_TYPES.TestingService);
/*	====================================================================================== */

// Middlewares

iocContainer.bind(MIDDLEWARES_TYPES.AuthBearerMiddleware).to(AuthBearerMiddleware).inSingletonScope();

export {
	userController,
	authController,
	authService,
	testingService,
	blogController,
	blogService,
	postController,
	userService,
	postService,
	passwordService,
	tokenService,
	iocContainer,
};
