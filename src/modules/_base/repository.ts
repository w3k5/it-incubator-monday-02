import { injectable } from 'inversify';

@injectable()
export class BaseRepository {
	skipCount(options: { pageSize: number; pageNumber: number }): number {
		return (options.pageNumber - 1) * options.pageSize;
	}

	countTotalPages(totalPages: number, pageSize: number): number {
		return Math.ceil(totalPages / pageSize);
	}
}
