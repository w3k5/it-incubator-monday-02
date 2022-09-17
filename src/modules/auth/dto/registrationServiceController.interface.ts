import { UserDatabase, UserOutputInterface } from '@models/user/types/entities';
import { ActivationDatabaseModel } from '../../activation/entities';

export interface RegistrationServiceControllerInterface {
	user: UserDatabase;
	activation: ActivationDatabaseModel;
}
