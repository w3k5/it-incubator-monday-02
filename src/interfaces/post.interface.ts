export interface PostInterface {
	id: number;
	title: string;
	shortDescription: string;
	content: string;
	bloggerId: number;
	bloggerName: string;
}

export type CreatePostInterface = Pick<
	PostInterface,
	'title' | 'shortDescription' | 'content' | 'bloggerId'
>;

export type UpdatePostType = Pick<
	PostInterface,
	'title' | 'shortDescription' | 'content' | 'bloggerId'
>;
