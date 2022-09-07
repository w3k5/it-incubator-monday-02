import { injectable } from 'inversify';
import { AbstractBaseRepository } from './abstractBaseRepository';

@injectable()
export class BaseRepository implements AbstractBaseRepository {
	skipCount(options: { pageSize: number; pageNumber: number }): number {
		return (options.pageNumber - 1) * options.pageSize;
	}

	countTotalPages(totalPages: number, pageSize: number): number {
		return Math.ceil(totalPages / pageSize);
	}
}
