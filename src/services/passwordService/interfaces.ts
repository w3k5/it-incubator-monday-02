import { HashedPassword, UnhashedPassword } from '../../modules/_base/types';

interface PasswordServiceInterface {
	hashPassword: (password: UnhashedPassword) => Promise<HashedPassword>;
	check: (unhashed: UnhashedPassword, hashed: HashedPassword) => Promise<boolean>;
}

export { PasswordServiceInterface };
