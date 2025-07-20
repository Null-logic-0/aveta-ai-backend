import { ApiPropertyOptional } from '@nestjs/swagger';
import { Tags } from '../enums/tags.enum';
import { ArrayNotEmpty, IsArray, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { Ranking } from '../enums/ranking.enum';

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
      return [value];
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
    description:
      'Sort by character popularity: liked | active | trending (likes + chats)',
    example: Ranking.TRENDING,
    enum: Ranking,
  })
  @IsOptional()
  @IsEnum(Ranking)
  ranking?: Ranking;
}
