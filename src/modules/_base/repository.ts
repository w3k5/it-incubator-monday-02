import { injectable } from 'inversify';
import { AbstractLogicalBaseRepository } from './abstractLogicalBaseRepository';

@injectable()
export class LogicalBaseRepository implements AbstractLogicalBaseRepository {
	skipCount(options: { pageSize: number; pageNumber: number }): number {
		return (options.pageNumber - 1) * options.pageSize;
	}

	countTotalPages(totalPages: number, pageSize: number): number {
		return Math.ceil(totalPages / pageSize);
	}
}
