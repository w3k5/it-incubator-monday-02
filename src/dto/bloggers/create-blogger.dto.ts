import { BloggerInterface } from '../../entities';

export type CreateBloggerDto = Pick<BloggerInterface, 'youtubeUrl' | 'name'>;
