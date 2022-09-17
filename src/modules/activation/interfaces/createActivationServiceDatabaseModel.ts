import { ObjectId } from 'mongodb';
import { UUIDV4 } from '../../_base/types';

export interface CreateActivationServiceDatabaseModel {
	userId: ObjectId;
	code: UUIDV4;
}
