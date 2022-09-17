import { ActivationDatabaseModel } from '../entities';
import { CreateActivationServiceModel } from '../interfaces/createActivationServiceModel';
import { UUIDV4 } from '../../_base/types';

export abstract class AbstractActivationService {
	abstract createActivationCode: (dto: CreateActivationServiceModel) => Promise<ActivationDatabaseModel>;
	abstract activate: (code: UUIDV4) => Promise<boolean>;
}
