import { LoginUserDto } from '../controller/auth.controller.types';
import { Token } from '../../../services/tokenService/interfaces';

export abstract class AbstractAuthService {
	abstract auth: (dto: LoginUserDto) => Promise<false | Token>;
}
