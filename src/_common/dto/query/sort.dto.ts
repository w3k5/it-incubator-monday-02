import { SortDirectionEnum } from '../../../enums';
import { IsEnum, IsOptional } from 'class-validator';

export class SortDto {
	@IsOptional()
	sortBy: string = 'createdAt';

	@IsOptional()
	@IsEnum(SortDirectionEnum)
	sortDirection: SortDirectionEnum = SortDirectionEnum.desc;
}
