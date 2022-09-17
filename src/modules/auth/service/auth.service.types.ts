import { LoginUserDto } from '../controller/auth.controller.types';
import { Token } from '../../../services/tokenService/interfaces';
import { RegisterBodyDto } from '../dto/registerBody.dto';
import { RegistrationServiceControllerInterface } from '../dto/registrationServiceController.interface';
import { UserEmail } from '../../_base/types';

export abstract class AbstractAuthService {
	abstract auth: (dto: LoginUserDto) => Promise<Token>;
	abstract registration: (dto: RegisterBodyDto) => Promise<RegistrationServiceControllerInterface>;
	abstract resendConfirmation: (email: UserEmail, code: string) => Promise<void>;
}
