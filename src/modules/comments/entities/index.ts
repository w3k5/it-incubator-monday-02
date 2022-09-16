import { IsoDate, ModelID, UserLogin } from '../../_base/types';
import { ObjectId } from 'mongoose';

interface CommentBaseModel {
	userId: ObjectId;
	content: string;
	userLogin: UserLogin;
}

type CommentDatabaseModel = CommentBaseModel & {
	createdAt: IsoDate;
	postId: ObjectId;
	_id: ObjectId;
};

type CommentOutputModel = CommentBaseModel & {
	createdAt: IsoDate;
	id: ModelID;
};

export { CommentDatabaseModel, CommentOutputModel };
