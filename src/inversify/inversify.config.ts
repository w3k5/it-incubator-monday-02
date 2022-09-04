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

const iocContainer = new Container();

iocContainer.bind<PasswordServiceInterface>(IOC_TYPES.PasswordService).to(PasswordService);
iocContainer.bind<DateServiceInterface>(IOC_TYPES.DateService).to(DateService);
iocContainer.bind<UserServiceInterface>(IOC_TYPES.UserService).to(UserService);
iocContainer.bind<UserControllerInterface>(IOC_TYPES.UserController).to(UserController);
iocContainer.bind<UserDatabaseRepositoryType>(IOC_TYPES.UserDatabaseRepository).to(UserDatabaseRepository);

export { iocContainer };
