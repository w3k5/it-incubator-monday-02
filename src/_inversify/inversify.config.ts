import 'reflect-metadata';
import { Container } from 'inversify';
import { IOC_TYPES } from './inversify.types';
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

const iocContainer = new Container();

/*	================================ Global Services ===================================== */
iocContainer.bind<PasswordServiceInterface>(IOC_TYPES.PasswordService).to(PasswordService);
iocContainer.bind<DateServiceInterface>(IOC_TYPES.DateService).to(DateService);
iocContainer.bind<AbstractTokenService>(IOC_TYPES.TokenService).to(TokenService);
iocContainer.bind<AbstractErrorBoundaryService>(IOC_TYPES.ErrorBoundaryService).to(ErrorBoundaryService);

const passwordService = iocContainer.get<PasswordServiceInterface>(IOC_TYPES.PasswordService);
/*	====================================================================================== */

/*	================================== User Services ===================================== */
iocContainer.bind<AbstractUserService>(IOC_TYPES.UserService).to(UserService);
iocContainer.bind<AbstractUserController>(IOC_TYPES.UserController).to(UserController);
iocContainer.bind<AbstractUserDatabaseRepository>(IOC_TYPES.UserDatabaseRepository).to(UserDatabaseRepository);

const userService = iocContainer.get<AbstractUserService>(IOC_TYPES.UserService);
const userController = iocContainer.get<AbstractUserController>(IOC_TYPES.UserController);
/*	====================================================================================== */

/*	================================== Auth Services ===================================== */
iocContainer.bind<AbstractAuthController>(IOC_TYPES.AuthController).to(AuthController);
iocContainer.bind<AbstractAuthService>(IOC_TYPES.AuthService).to(AuthService);

const authController = iocContainer.get<AbstractAuthController>(IOC_TYPES.AuthController);
/*	====================================================================================== */

/*	================================== Blog Services ===================================== */
iocContainer.bind<AbstractBlogDatabaseRepository>(IOC_TYPES.BlogDatabaseRepository).to(BlogsDatabaseRepository);
iocContainer.bind<AbstractBlogService>(IOC_TYPES.BlogService).to(BlogsService);
iocContainer.bind<AbstractBlogController>(IOC_TYPES.BlogController).to(BlogsController);

const blogController = iocContainer.get<AbstractBlogController>(IOC_TYPES.BlogController);
const blogService = iocContainer.get<AbstractBlogService>(IOC_TYPES.BlogService);
/*	====================================================================================== */

/*	================================== Post Services ===================================== */
iocContainer.bind<AbstractPostDatabaseRepository>(IOC_TYPES.PostDatabaseRepository).to(PostDatabaseRepository);
iocContainer.bind<AbstractPostService>(IOC_TYPES.PostService).to(PostService);
iocContainer.bind<AbstractPostController>(IOC_TYPES.PostController).to(PostController);

const postService = iocContainer.get<AbstractPostService>(IOC_TYPES.PostService);
const postController = iocContainer.get<AbstractPostController>(IOC_TYPES.PostController);
/*	====================================================================================== */

// TODO: Требуется разобраться с этим модулем, разбить, описать интерфейсы
/*	================================ Testing Services ===================================== */
iocContainer.bind(IOC_TYPES.TestingService).to(TestingDomain);

const testingService = iocContainer.get(IOC_TYPES.TestingService);
/*	====================================================================================== */

export {
	userController,
	authController,
	testingService,
	blogController,
	blogService,
	postController,
	userService,
	postService,
	passwordService,
};
