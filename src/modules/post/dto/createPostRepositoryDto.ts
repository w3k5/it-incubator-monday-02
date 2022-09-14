import { PostBaseModel } from '../entities';

type CreatePostRepositoryDto = Pick<PostBaseModel, 'blogName' | 'blogId' | 'shortDescription' | 'content' | 'title'>;

export { CreatePostRepositoryDto };
