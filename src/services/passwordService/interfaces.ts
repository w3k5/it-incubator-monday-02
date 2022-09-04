import { HashedPassword, UnhashedPassword } from '@models/user/types/primitives';

interface PasswordServiceInterface {
	hashPassword: (password: UnhashedPassword) => Promise<HashedPassword>;
	check: (password: HashedPassword) => boolean;
}

export { PasswordServiceInterface };
