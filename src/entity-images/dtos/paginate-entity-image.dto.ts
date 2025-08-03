import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { GetEntityImagesQueryDto } from './get-entity-images-query.dto';

export class PaginateEntityImageDto extends GetEntityImagesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number;
}
