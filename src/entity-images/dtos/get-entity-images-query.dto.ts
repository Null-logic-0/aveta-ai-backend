import { IsEnum, IsOptional } from 'class-validator';
import { EntityImageType } from '../enums/entity-images.enum';

export class GetEntityImagesQueryDto {
  @IsOptional()
  @IsEnum(EntityImageType)
  type?: EntityImageType;
}
