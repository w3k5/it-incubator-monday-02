import { Length } from 'class-validator';

export class CreateCommentDto {
	@Length(20, 300)
	public content: string;
}

export interface CreateCommentDatabaseDto {
	content: string;
	userId: string;
	postId: string;
	userLogin: string;
}
