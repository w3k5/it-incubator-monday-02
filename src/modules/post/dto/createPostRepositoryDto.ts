import { PostBaseModel } from '../entities';

type CreatePostRepositoryDto = Pick<PostBaseModel, 'blogName' | 'shortDescription' | 'content' | 'title'> & {
	blogId: string;
};

export { CreatePostRepositoryDto };
