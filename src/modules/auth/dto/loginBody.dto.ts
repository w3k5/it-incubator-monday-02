import { IsString } from 'class-validator';

export class LoginBodyDto {
	@IsString()
	login: string;

	@IsString()
	password: string;
}
