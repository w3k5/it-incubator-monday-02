import { PaginationParams } from '@app/common-types';
import { UserDatabaseType } from '../../entities';

export type GetAllUsersParams = PaginationParams;

export type GetAllUsersResponse = UserDatabaseType[];
