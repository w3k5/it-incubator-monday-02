import { Container } from 'inversify';
import { IOC_TYPES } from './inversify.types';
import { PasswordService } from '../services/passwordService/index';
import { PasswordServiceInterface } from '../services/passwordService/interfaces';
import { UserService } from '../modules/user/service/service';
import { UserServiceInterface } from '@models/user/service/service.types';
import { UserController } from '../modules/user/controllers/controller';
import { UserControllerInterface } from '../modules/user/controllers/controller.types';
import { UserDatabaseRepositoryType } from '../modules/user/repository/repository.interface';
import { UserDatabaseRepository } from '../modules/user/repository/repository';
import { DateServiceInterface } from '../services/dateService/interfaces';
import { DateService } from '../services/dateService';
import { AuthController } from '../modules/auth/controller/auth.controller';
import { AuthControllerInterface } from '../modules/auth/controller/auth.controller.types';
import { AuthServiceInterface } from '../modules/auth/service/auth.service.types';
import { AuthService } from '../modules/auth/service/auth.service';

const iocContainer = new Container();

/**
 * Global Services
 */
iocContainer.bind<PasswordServiceInterface>(IOC_TYPES.PasswordService).to(PasswordService);
iocContainer.bind<DateServiceInterface>(IOC_TYPES.DateService).to(DateService);

/**
 * User
 */
iocContainer.bind<UserServiceInterface>(IOC_TYPES.UserService).to(UserService);
iocContainer.bind<UserControllerInterface>(IOC_TYPES.UserController).to(UserController);
iocContainer.bind<UserDatabaseRepositoryType>(IOC_TYPES.UserDatabaseRepository).to(UserDatabaseRepository);

const userController = iocContainer.get<UserControllerInterface>(IOC_TYPES.UserController);
/**
 * Auth
 */

iocContainer.bind<AuthControllerInterface>(IOC_TYPES.AuthController).to(AuthController);
iocContainer.bind<AuthServiceInterface>(IOC_TYPES.AuthService).to(AuthService);

const authController = iocContainer.get<AuthControllerInterface>(IOC_TYPES.AuthController);

export { iocContainer, userController, authController };
