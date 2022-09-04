import 'reflect-metadata';
import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { PasswordServiceInterface } from './interfaces';
import { HashedPassword, UnhashedPassword } from '../../modules/_base/types';

@injectable()
export class PasswordService implements PasswordServiceInterface {
	async check(unhashed: UnhashedPassword, hashed: HashedPassword): Promise<boolean> {
		return bcrypt.compare(unhashed, hashed);
	}

	async hashPassword(password: UnhashedPassword): Promise<HashedPassword> {
		return await bcrypt.hash(password, 10);
	}
}
