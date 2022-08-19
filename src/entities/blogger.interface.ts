export interface BloggerInterface {
	name: string;
	youtubeUrl: string;
}

export type CreateBloggerType = Pick<BloggerInterface, 'name' | 'youtubeUrl'>;

export type BloggerResponseType = Omit<BloggerInterface, '_id'> & { id: string };

export interface GetAllResponseInterface<T> {
	total: number;
	items: T[];
}
