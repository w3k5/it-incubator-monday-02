import { UserBaseModel } from '../entities';
import { HashedPassword, UnhashedPassword } from '../primitives';

/**
 * Controller to Service
 */
export type CreateUserServiceDto = UserBaseModel & UnhashedPassword;

/**
 * Service to Repository
 */
export type CreateUserRepositoryDto = UserBaseModel & { password: HashedPassword };
