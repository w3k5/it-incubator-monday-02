import {
	DatabaseInterface,
	HashedPassword,
	IsoDate,
	ModelID,
	UnhashedPassword,
	UserEmail,
	UserLogin,
} from '../../../_base/types';

interface UserBaseModel {
	email: UserEmail;
	login: UserLogin;
}

interface UserInputInterface extends UserBaseModel {
	password: UnhashedPassword;
}

interface UserOutputInterface extends UserBaseModel {
	createdAt: IsoDate;
	id: ModelID;
}

type UserDatabase = UserBaseModel & DatabaseInterface & { password: HashedPassword };

/**
 * EXPORTS
 */
export { UserInputInterface, UserOutputInterface, UserDatabase, UserBaseModel };
