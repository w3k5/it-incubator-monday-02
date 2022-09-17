import { AbstractActivationRepositoryCommand } from './types/activation.repository.command.abstract';
import { inject, injectable } from 'inversify';
import { CreateActivationServiceDatabaseModel } from './interfaces/createActivationServiceDatabaseModel';
import { ActivationDatabaseModel } from './entities';
import { ActivationModel } from './activation.schema';
import { IOC_TYPES } from '../../_inversify/inversify.types';
import { DateServiceInterface } from '../../services/dateService/interfaces';
import { UUIDV4 } from '../_base/types';

@injectable()
export class ActivationRepositoryCommand implements AbstractActivationRepositoryCommand {
	constructor(@inject(IOC_TYPES.DateService) private readonly dateService: DateServiceInterface) {}

	async createActivation({ userId, code }: CreateActivationServiceDatabaseModel): Promise<ActivationDatabaseModel> {
		const createdAt = this.dateService.now();
		const expirationAt = this.dateService.addDays(createdAt, 7);
		return ActivationModel.create({ userId, code, createdAt, expirationAt });
	}

	async drop(): Promise<void> {
		await ActivationModel.deleteMany({});
	}

	async activate(code: UUIDV4): Promise<boolean> {
		const activationResult = await ActivationModel.updateOne({ code }, { isActivated: true });
		return !!activationResult.modifiedCount;
	}
}
