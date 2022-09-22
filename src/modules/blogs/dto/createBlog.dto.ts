import { BlogInputInterface } from '../entities';
import { IsString, IsUrl, Length } from 'class-validator';

export class CreateBlogDto implements BlogInputInterface {
	@IsString()
	@Length(1, 15)
	name: string;

	@IsUrl()
	@Length(1, 100)
	youtubeUrl: string;
}
