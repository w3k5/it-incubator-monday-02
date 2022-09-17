import { DatabaseInterfaceV2, HashedPassword, UnhashedPassword, UserEmail, UserLogin } from '../../../_base/types';
import { ObjectId } from 'mongodb';

interface UserBaseModel {
	email: UserEmail;
	login: UserLogin;
}

interface UserInputInterface extends UserBaseModel {
	password: UnhashedPassword;
}

interface UserOutputInterface extends UserBaseModel {
	createdAt: Date;
	id: string;
}

type UserDatabase = UserBaseModel & DatabaseInterfaceV2 & { password: HashedPassword };

/**
 * EXPORTS
 */
export { UserInputInterface, UserOutputInterface, UserDatabase, UserBaseModel };
