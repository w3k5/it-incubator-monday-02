import { ObjectId } from 'mongoose';
import { IsoDate } from '../../_base/types';

interface ActivationBaseModel {
	code: string;
}

interface ActivationDatabaseModel extends ActivationBaseModel {
	_id: ObjectId;
	userId: ObjectId;
	createdAt: Date;
	expirationAt: Date;
	isActivated: boolean;
}

export { ActivationDatabaseModel, ActivationBaseModel };
