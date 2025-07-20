import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { GetAllCharactersFilterDto } from 'src/characters/dtos/get-all-characters-filter.dto';

export class PaginationQueryDto extends GetAllCharactersFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number;
}
