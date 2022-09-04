import { UserDatabase } from '../../types/entities';
import { CreateUserRepositoryDto } from '../../types/dto/createUserRepositoryDto';

export type CreateUserRepositoryMethodType = (data: CreateUserRepositoryDto) => UserDatabase;
