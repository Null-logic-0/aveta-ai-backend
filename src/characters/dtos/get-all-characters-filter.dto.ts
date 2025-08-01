import { ApiPropertyOptional } from '@nestjs/swagger';
import { Tags } from '../enums/tags.enum';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetAllCharactersFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by one or more tags',
    example: ['romantic', 'fantasy'],
    isArray: true,
    enum: Tags,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.split(',');
    }
    if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
      return value as string[];
    }
    return [];
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Tags, { each: true })
  tags?: Tags[];

  @ApiPropertyOptional({
    description: 'Search Character',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
