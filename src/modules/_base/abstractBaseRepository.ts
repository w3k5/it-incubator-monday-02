export abstract class AbstractBaseRepository {
	abstract skipCount: (options: { pageSize: number; pageNumber: number }) => number;
	abstract countTotalPages: (totalPages: number, pageSize: number) => number;
}
