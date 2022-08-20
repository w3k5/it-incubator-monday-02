import { ObjectId } from 'mongodb';

export interface PostInterface {
	id: number;
	bloggerName: string;
	title: string;
	shortDescription: string;
	content: string;
	bloggerId: number;
	createdAt: string;
}

export type CreatePostType = Omit<PostInterface, 'bloggerName'>;

// export type PostsResponseType = Omit<PostInterface, 'id'> & { id: string };
export type PostsResponseType = PostInterface;

export type UpdatePostType = Omit<PostInterface, 'bloggerName'>;
