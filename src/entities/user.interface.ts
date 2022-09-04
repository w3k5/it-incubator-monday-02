import { EntityId } from '@app/common-types';

type UnhashedPassword = string;
type UserLogin = string;
type UserEmail = string;

export interface UserInterface {
	login: string;
	password: string;
	// email: UserEmail;
}

export type UserDatabaseType = UserInterface & EntityId;

export type UserResponseType = Omit<UserDatabaseType, 'password'>;
