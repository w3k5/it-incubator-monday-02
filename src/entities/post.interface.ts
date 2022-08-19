export interface PostInterface {
	bloggerName: string;
	title: string;
	shortDescription: string;
	content: string;
	bloggerId: number;
}

export type CreatePostType = Omit<PostInterface, 'bloggerName'>;

export type PostsResponseType = Omit<PostInterface, 'id'> & { id: string };

export type UpdatePostType = Omit<PostInterface, 'bloggerName'>;
