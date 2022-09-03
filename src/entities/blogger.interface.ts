import { EntityId } from '@app/common-types';

interface createdAtInterface {
	createdAt: Date;
}

export interface BloggerInterface {
	name: string;
	youtubeUrl: string;
	createdAt: string;
}

export type BloggerDatabaseType = BloggerInterface & EntityId;

// TODO: homework 4
// export type BloggerResponseType = Omit<BloggerInterface, '_id'> & { id: string };

export type BloggerResponseType = BloggerDatabaseType;
