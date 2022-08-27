import { PostInterface } from '../../entities';

export type CreatePostDto = Pick<PostInterface, 'bloggerId' | 'content' | 'title' | 'shortDescription'>;

export type UpdatePostDto = Pick<PostInterface, 'bloggerId' | 'content' | 'title' | 'shortDescription' | 'bloggerName'>;
