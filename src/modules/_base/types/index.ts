export type ModelID = string;
export type MongoDbID = string;
export type IsoDate = string;
export type UserLogin = string;
export type UserEmail = string;
export type UnhashedPassword = string;
export type HashedPassword = string;

export type GetAllRepositoryResponse<T> = { documents: T[]; totalCount: number; pagesCount: number };

export interface DatabaseInterface {
	createdAt: IsoDate;
	_id: MongoDbID;
}
