import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	@Min(1)
	pageSize: number = 10;

	@IsOptional()
	@IsInt()
	@Type(() => Number)
	@Min(1)
	pageNumber: number = 1;
}
