import {
	HashedPassword,
	IsoDate,
	ModelID,
	MongoDbID,
	UnhashedPassword,
	UserEmail,
	UserLogin,
} from '../../../_base/types';

interface DatabaseInterface {
	createdAt: IsoDate;
	_id: MongoDbID;
}

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

export type GetAllDomainResponse = { documents: UserOutputInterface[]; totalCount: number; pagesCount: number };

type UserDatabase = UserBaseModel & DatabaseInterface & { password: HashedPassword };

/**
 * EXPORTS
 */
export { UserInputInterface, UserOutputInterface, UserDatabase, UserBaseModel };
