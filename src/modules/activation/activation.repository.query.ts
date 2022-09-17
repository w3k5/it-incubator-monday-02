import { AbstractActivationRepositoryQuery } from './types/activation.repository.query.abstract';
import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import { ActivationDatabaseModel } from './entities';
import { Nullable } from '../../_common/types';
import { ActivationModel } from './activation.schema';

@injectable()
export class ActivationRepositoryQuery implements AbstractActivationRepositoryQuery {
	public async getActivationInstanceByUserId(userId: ObjectId): Promise<Nullable<ActivationDatabaseModel>> {
		const candidate = await ActivationModel.findOne({ userId });
		return candidate || null;
	}
}
