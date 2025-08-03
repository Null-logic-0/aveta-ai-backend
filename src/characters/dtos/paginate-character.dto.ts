import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { GetAllCharactersFilterDto } from './get-all-characters-filter.dto';

export class PaginateCharacterDto extends GetAllCharactersFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number;
}
