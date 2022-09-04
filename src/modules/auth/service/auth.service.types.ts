import { LoginUserDto } from '../controller/auth.controller.types';

export interface AuthServiceInterface {
	isAuth: (dto: LoginUserDto) => Promise<boolean>;
}
