import {
	AbstractAuthController,
	AbstractAuthService,
	AbstractTokenService,
	AbstractUserDatabaseRepository,
	AuthController,
	AuthService,
	Container,
	DateService,
	DateServiceInterface,
	IOC_TYPES,
	PasswordService,
	PasswordServiceInterface,
	TokenService,
	UserController,
	UserControllerInterface,
	UserDatabaseRepository,
	UserService,
	UserServiceInterface,
} from './imports';

const iocContainer = new Container();

/**
 * Global Services
 */
iocContainer.bind<PasswordServiceInterface>(IOC_TYPES.PasswordService).to(PasswordService);
iocContainer.bind<DateServiceInterface>(IOC_TYPES.DateService).to(DateService);
iocContainer.bind<AbstractTokenService>(IOC_TYPES.TokenService).to(TokenService);

/**
 * User
 */
iocContainer.bind<UserServiceInterface>(IOC_TYPES.UserService).to(UserService);
iocContainer.bind<UserControllerInterface>(IOC_TYPES.UserController).to(UserController);
iocContainer.bind<AbstractUserDatabaseRepository>(IOC_TYPES.UserDatabaseRepository).to(UserDatabaseRepository);

const userController = iocContainer.get<UserControllerInterface>(IOC_TYPES.UserController);
/**
 * Auth
 */

iocContainer.bind<AbstractAuthController>(IOC_TYPES.AuthController).to(AuthController);
iocContainer.bind<AbstractAuthService>(IOC_TYPES.AuthService).to(AuthService);

const authController = iocContainer.get<AbstractAuthController>(IOC_TYPES.AuthController);

export { userController, authController };
