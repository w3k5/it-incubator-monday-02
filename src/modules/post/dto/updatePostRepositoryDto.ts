import { PostBaseModel } from '../entities';

type UpdatePostRepositoryDto = Pick<PostBaseModel, 'blogId' | 'content' | 'title' | 'shortDescription' | 'blogName'>;

export { UpdatePostRepositoryDto };
