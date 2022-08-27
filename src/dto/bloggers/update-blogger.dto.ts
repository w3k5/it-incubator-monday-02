import { CreateBloggerDto } from './create-blogger.dto';

export type UpdateBloggerDto = Pick<CreateBloggerDto, 'name' | 'youtubeUrl'>;
