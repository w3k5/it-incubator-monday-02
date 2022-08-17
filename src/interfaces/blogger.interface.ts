export interface BloggerInterface {
	id: number;
	name: string;
	youtubeUrl: string;
}

export type CreateBloggerInterface = Pick<
	BloggerInterface,
	'name' | 'youtubeUrl'
>;
