import { DatabaseInterface, IsoDate, ModelID } from '../../_base/types';

interface BlogBaseModel {
	name: string;
	youtubeUrl: string;
}

interface BlogOutputInterface extends BlogBaseModel {
	createdAt: IsoDate;
	id: ModelID;
}

type BlogInputInterface = BlogBaseModel;

type BlogDatabase = BlogBaseModel & DatabaseInterface;

export { BlogOutputInterface, BlogInputInterface, BlogDatabase };
