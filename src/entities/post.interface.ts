import { ObjectId } from 'mongodb';
import { EntityId } from '@app/common-types';

export interface PostInterface extends EntityId {
	bloggerName: string;
	title: string;
	shortDescription: string;
	content: string;
	bloggerId: number;
	// createdAt: string;
}

// export type PostsResponseType = Omit<PostInterface, 'id'> & { id: string };
export type PostsResponseType = PostInterface;
