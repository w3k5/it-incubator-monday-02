import { DatabaseInterfaceV2, ModelID } from '../../_base/types';
import { ObjectId } from 'mongodb';

interface PostBaseModel {
	blogName: string;
	title: string;
	shortDescription: string;
	content: string;
	blogId: ObjectId;
}

type PostInputInterface = Pick<PostBaseModel, 'content' | 'title' | 'shortDescription'> & { blogId: string };

type PostInputUpdateInterface = Pick<PostBaseModel, 'content' | 'title' | 'shortDescription'> & { blogId: string };

interface PostOutputInterface extends PostBaseModel {
	createdAt: Date;
	id: ModelID;
}

type PostDatabase = PostBaseModel & DatabaseInterfaceV2;

export { PostInputInterface, PostOutputInterface, PostDatabase, PostInputUpdateInterface, PostBaseModel };
