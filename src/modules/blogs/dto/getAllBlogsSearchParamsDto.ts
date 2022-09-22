import { IntersectionType } from '@nestjs/mapped-types';
import { PaginationDto } from '../../../_common/dto/query/pagination.dto';
import { SortDto } from '../../../_common/dto/query/sort.dto';
import { IsOptional, IsString } from 'class-validator';

export class GetAllBlogsSearchParamsDto extends IntersectionType(PaginationDto, SortDto) {
	@IsOptional()
	@IsString()
	searchNameTerm: string | null = null;
}
