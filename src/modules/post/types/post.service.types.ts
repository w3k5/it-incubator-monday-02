import { GetAllRepositoryResponse, ModelID } from '../../_base/types';
import { GetAllPostQueryParams } from './_post.common.types';
import { PostInputInterface, PostInputUpdateInterface, PostOutputInterface } from '../entities';

abstract class AbstractPostService {
	abstract getAllPosts: (params: GetAllPostQueryParams) => Promise<GetAllRepositoryResponse<PostOutputInterface>>;
	abstract getPostById: (id: ModelID) => Promise<PostOutputInterface>;
	abstract createPost: (data: PostInputInterface) => Promise<PostOutputInterface>;
	abstract updatePostById: (id: ModelID, data: PostInputUpdateInterface) => Promise<boolean>;
	abstract deletePostById: (id: ModelID) => Promise<boolean>;
	abstract drop: () => Promise<void>;
}

export { AbstractPostService };
