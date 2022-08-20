export interface BloggerInterface {
	id: number;
	name: string;
	youtubeUrl: string;
}

export type CreateBloggerType = Pick<BloggerInterface, 'name' | 'youtubeUrl'>;

// TODO: homework 4
// export type BloggerResponseType = Omit<BloggerInterface, '_id'> & { id: string };

export type BloggerResponseType = BloggerInterface & { _id: string };

export interface GetAllResponseInterface<T> {
	total: number;
	items: T[];
}
