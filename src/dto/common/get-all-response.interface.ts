export interface GetAllResponseInterface<Entity> {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: Entity[];
}
