/**
 * @param options
 */
export const paginationBuilder = (options: { pageSize: number; pageNumber: number }) => {
	const skip = (options.pageNumber - 1) * options.pageSize;
	return {
		pageNumber: options.pageNumber,
		pageSize: options.pageSize,
		skip,
	};
};

export const countTotalPages = (totalDocuments: number, pageSize: number) => {
	return Math.ceil(totalDocuments / pageSize);
};
