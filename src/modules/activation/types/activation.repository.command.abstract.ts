import { AbstractBaseRepository } from '../../_base/abstractBaseRepository';
import { CreateActivationServiceDatabaseModel } from '../interfaces/createActivationServiceDatabaseModel';
import { ActivationDatabaseModel } from '../entities';
import { UUIDV4 } from '../../_base/types';

export abstract class AbstractActivationRepositoryCommand implements AbstractBaseRepository {
	abstract drop: () => Promise<void>;
	abstract createActivation: (dto: CreateActivationServiceDatabaseModel) => Promise<ActivationDatabaseModel>;
	abstract activate: (code: UUIDV4) => Promise<boolean>;
}
