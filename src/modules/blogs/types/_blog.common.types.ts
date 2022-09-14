import { BlogOutputInterface } from '../entities';
import { PaginationParams, SortInterface } from '../../../_common/types';

type GetAllBlogQueryParams = Partial<
	SortInterface<BlogOutputInterface> &
		PaginationParams & {
			searchNameTerm: string | null;
		}
>;

export { GetAllBlogQueryParams };
