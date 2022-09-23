import {AbstractActivationService} from './types/activation.service.abstract';
import {inject, injectable} from 'inversify';
import {v4 as uuid} from 'uuid';
import {CreateActivationServiceDatabaseModel} from './interfaces/createActivationServiceDatabaseModel';
import {ActivationDatabaseModel} from './entities';
import {REPOSITORIES_TYPES} from '../../_inversify/inversify.types';
import {AbstractActivationRepositoryCommand} from './types/activation.repository.command.abstract';
import {CreateActivationServiceModel} from './interfaces/createActivationServiceModel';
import {UUIDV4} from '../_base/types';
import {Nullable} from "../../_common/types";

@injectable()
export class ActivationService implements AbstractActivationService {
	constructor(
		@inject(REPOSITORIES_TYPES.ActivationCommandRepository)
		private readonly activationCommandRepository: AbstractActivationRepositoryCommand,
	) {
	}

	createActivationCode({userId}: CreateActivationServiceModel): Promise<ActivationDatabaseModel> {
		const code = uuid();
		return this.activationCommandRepository.createActivation({code, userId});
	}

	activate(code: UUIDV4): Promise<boolean> {
		return this.activationCommandRepository.activate(code);
	}

	async updateActivationCode(oldCode: UUIDV4): Promise<Nullable<UUIDV4>> {
		const newCode = uuid();
		const updateResult = await this.activationCommandRepository.updateActivationCode(oldCode, newCode);
		return updateResult ? newCode : null;
	}

}
