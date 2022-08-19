export interface getAllResponse<Entity> {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: Entity[];
}
