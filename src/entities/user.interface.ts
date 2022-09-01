import { EntityId } from '@app/common-types';

export interface UserInterface {
	login: string;
	password: string;
}

export type UserDatabaseType = UserInterface & EntityId;

export type UserResponseType = Omit<UserDatabaseType, 'password'>;
