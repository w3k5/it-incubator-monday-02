import { IsEmail } from 'class-validator';
import { UserEmail } from '../../_base/types';

export class ResendingCodeBodyDto {
	@IsEmail()
	email: UserEmail;
}
