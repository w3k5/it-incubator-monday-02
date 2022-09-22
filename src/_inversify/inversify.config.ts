import 'reflect-metadata';
import { Container } from 'inversify';
import {
	IOC_TYPES,
	MIDDLEWARES_TYPES,
	REPOSITORIES_TYPES,
	SERVICES_TYPES,
	GLOBAL_SERVICES_TYPES,
} from './inversify.types';
import {
	AbstractAuthService,
	AbstractBlogController,
	AbstractBlogService,
	AbstractTokenService,
	AbstractUserDatabaseRepository,
	AuthService,
	_deprecatedBlogsController,
	_deprecatedBlogsService,
	DateService,
	AbstractDateService,
	PasswordService,
	PasswordServiceInterface,
	TestingDomain,
	AbstractBlogDatabaseRepository,
	_deprecatedBlogsDatabaseRepository,
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
	CommentsRepository,
	PostController,
	AbstractCommentsRepository,
	PostRepositoryQuery,
	AbstractCommentsService,
	AbstractActivationService,
	AbstractPostController,
	ActivationRepositoryCommand,
	AbstractCommentsQueryRepository,
	CommentsQueryRepository,
	CommentsService,
	ActivationService,
	AuthBearerMiddleware,
	AbstractActivationRepositoryCommand,
	ActivationRepositoryQuery,
	AbstractPostRepositoryQueryTypes,
	AbstractActivationRepositoryQuery,
} from './imports';
import { AbstractMailerService } from '../services/mailer/mailer.service.abstract';
import { MailerService } from '../services/mailer/mailer.service';

const iocContainer = new Container();

/*	================================ Global Services ===================================== */
iocContainer.bind<PasswordServiceInterface>(IOC_TYPES.PasswordService).to(PasswordService).inSingletonScope();
iocContainer.bind<AbstractDateService>(IOC_TYPES.DateService).to(DateService).inSingletonScope();
iocContainer.bind<AbstractTokenService>(IOC_TYPES.TokenService).to(TokenService).inSingletonScope();
iocContainer
	.bind<AbstractErrorBoundaryService>(IOC_TYPES.ErrorBoundaryService)
	.to(ErrorBoundaryService)
	.inSingletonScope();
iocContainer.bind<AbstractMailerService>(GLOBAL_SERVICES_TYPES.EmailService).to(MailerService).inSingletonScope();

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

/*	================================== Blog Services ===================================== */
iocContainer
	.bind<AbstractBlogDatabaseRepository>(IOC_TYPES.BlogDatabaseRepository)
	.to(_deprecatedBlogsDatabaseRepository)
	.inSingletonScope();
iocContainer.bind<AbstractBlogService>(IOC_TYPES.BlogService).to(_deprecatedBlogsService).inSingletonScope();
iocContainer.bind<AbstractBlogController>(IOC_TYPES.BlogController).to(_deprecatedBlogsController).inSingletonScope();

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

/*	==================================== Activation ====================================== */
iocContainer
	.bind<AbstractActivationRepositoryQuery>(REPOSITORIES_TYPES.ActivationQueryRepository)
	.to(ActivationRepositoryQuery)
	.inSingletonScope();
iocContainer
	.bind<AbstractActivationRepositoryCommand>(REPOSITORIES_TYPES.ActivationCommandRepository)
	.to(ActivationRepositoryCommand)
	.inSingletonScope();

iocContainer.bind<AbstractActivationService>(SERVICES_TYPES.ActivationService).to(ActivationService).inSingletonScope();

/*	====================================================================================== */

/*	================================== Auth Services ===================================== */
iocContainer.bind<AbstractAuthService>(IOC_TYPES.AuthService).to(AuthService).inSingletonScope();

const authService = iocContainer.get<AbstractAuthService>(IOC_TYPES.AuthService);
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
