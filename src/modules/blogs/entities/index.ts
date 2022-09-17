import { DatabaseInterfaceV2, IsoDate, ModelID } from '../../_base/types';

interface BlogBaseModel {
	name: string;
	youtubeUrl: string;
}

interface BlogOutputInterface extends BlogBaseModel {
	createdAt: Date;
	id: ModelID;
}

type BlogInputInterface = BlogBaseModel;

type BlogDatabase = BlogBaseModel & DatabaseInterfaceV2;

export { BlogOutputInterface, BlogInputInterface, BlogDatabase };
