import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Blog title.',
    example: 'Why Nations Fail?',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(10, { message: 'Title must be at least 10 characters' })
  @MaxLength(100, { message: 'Title must be under 100 characters' })
  title: string;

  @ApiProperty({
    description: 'Blog image.',
    example: 'http://example.com/media/image.jpg',
  })
  @IsString()
  @IsOptional()
  media?: string;

  @ApiProperty({
    description: 'Blog Excerpt.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Excerpt is required' })
  @MinLength(10, { message: 'Excerpt must be at least 10 characters' })
  @MaxLength(1000, { message: 'Excerpt must be under 1000 characters' })
  excerpt: string;
}
