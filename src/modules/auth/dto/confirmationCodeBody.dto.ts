import { IsUUID } from 'class-validator';

export class ConfirmationCodeBodyDto {
	@IsUUID()
	code: string;
}
