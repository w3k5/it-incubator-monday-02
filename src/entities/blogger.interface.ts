import { EntityId } from '@app/common-types';

interface createdAtInterface {
	createdAt: Date;
}

export interface BloggerInterface extends EntityId {
	name: string;
	youtubeUrl: string;
	// createdAt: string;
}

export type CreateBloggerType = Pick<BloggerInterface, 'name' | 'youtubeUrl'>;

// TODO: homework 4
// export type BloggerResponseType = Omit<BloggerInterface, '_id'> & { id: string };

export type BloggerResponseType = BloggerInterface;
