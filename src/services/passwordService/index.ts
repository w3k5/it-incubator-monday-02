import 'reflect-metadata';
import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { PasswordServiceInterface } from './interfaces';
import { HashedPassword, UnhashedPassword } from '@models/user/types/primitives';

@injectable()
export class PasswordService implements PasswordServiceInterface {
	check(password: HashedPassword): boolean {
		const isPasswordValid = false; // MOCKED
		return isPasswordValid;
	}

	async hashPassword(password: UnhashedPassword): Promise<HashedPassword> {
		return await bcrypt.hash(password, 10);
	}
}
