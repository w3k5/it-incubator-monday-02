import { DatabaseInterface, IsoDate, ModelID } from '../../_base/types';

interface PostBaseModel {
	blogName: string;
	title: string;
	shortDescription: string;
	content: string;
	blogId: ModelID;
}

type PostInputInterface = Pick<PostBaseModel, 'blogId' | 'content' | 'title' | 'shortDescription'>;

type PostInputUpdateInterface = Pick<PostBaseModel, 'blogId' | 'content' | 'title' | 'shortDescription'>;

interface PostOutputInterface extends PostBaseModel {
	createdAt: IsoDate;
	id: ModelID;
}

type PostDatabase = PostBaseModel & DatabaseInterface;

export { PostInputInterface, PostOutputInterface, PostDatabase, PostInputUpdateInterface, PostBaseModel };
