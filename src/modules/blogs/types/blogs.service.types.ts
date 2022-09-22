import { GetAllBlogQueryParams } from './_blog.common.types';
import { GetAllRepositoryResponse, ModelID } from '../../_base/types';
import { BlogInputInterface, BlogOutputInterface } from '../entities';
import { _deprecatedUpdateBlogRepositoryDto } from '../dto/_deprecated.updateBlogRepositoryDto';

abstract class AbstractBlogService {
	abstract getAllBlogs: (params: GetAllBlogQueryParams) => Promise<GetAllRepositoryResponse<BlogOutputInterface>>;
	abstract getBlogById: (id: ModelID) => Promise<BlogOutputInterface>;
	abstract createBlog: (data: BlogInputInterface) => Promise<BlogOutputInterface>;
	abstract updateBlogById: (id: ModelID, data: _deprecatedUpdateBlogRepositoryDto) => Promise<boolean>;
	abstract deleteBlogById: (id: ModelID) => Promise<boolean>;
	abstract drop: () => Promise<void>;
}

export { AbstractBlogService };
