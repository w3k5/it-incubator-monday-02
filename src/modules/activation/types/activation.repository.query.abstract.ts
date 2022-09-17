import { ObjectId } from 'mongodb';
import { Nullable } from '../../../_common/types';
import { ActivationDatabaseModel } from '../entities';

export abstract class AbstractActivationRepositoryQuery {
	abstract getActivationInstanceByUserId: (userId: ObjectId) => Promise<Nullable<ActivationDatabaseModel>>;
}
