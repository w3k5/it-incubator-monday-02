import { IsEmail, IsString, Length } from 'class-validator';
import { UnhashedPassword, UserEmail, UserLogin } from '../../_base/types';

export class RegisterBodyDto {
	@IsString()
	@Length(3, 10)
	login: UserLogin;

	@IsString()
	@Length(6, 20)
	password: UnhashedPassword;

	@IsEmail()
	email: UserEmail;
}
