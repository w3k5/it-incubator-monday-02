import { PostOutputInterface } from '../entities';
import { ModelID } from '../../_base/types';
import { PaginationParams, SortInterface } from '../../../_common/types';

type GetAllPostQueryParams = Partial<
	SortInterface<PostOutputInterface> &
		PaginationParams & {
			blogId: ModelID | null;
		}
>;

export { GetAllPostQueryParams };
