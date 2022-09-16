import { CommentOutputModel } from '../entities';
import { PaginationParams, SortInterface } from '../../../_common/types';

type GetAllCommentsQueryParams = Partial<SortInterface<CommentOutputModel> & PaginationParams>;

export { GetAllCommentsQueryParams };
