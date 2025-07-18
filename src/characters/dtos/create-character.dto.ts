import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Visibility } from '../enums/visibility.enum';
import { Tags } from '../enums/tags.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCharacterDto {
  @ApiProperty({
    description: 'Character name.',
    example: 'Tobey Maguire',
  })
  @IsString()
  @MaxLength(96)
  @MinLength(2)
  @IsNotEmpty()
  characterName: string;

  @ApiProperty({
    description: 'Character profile image',
    example: 'https://example.com/characters/profile.png',
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    description: 'Tagline for character creation.',
    example: `Once the friendly neighborhood Spider-Man, 
    now a swaggering, jazz-dancing menace to both villains and common decency. 
    He’s not just fighting crime—he’s embarrassing it.`,
  })
  @IsString()
  @MaxLength(1000)
  @MinLength(10)
  @IsNotEmpty()
  tagline: string;

  @ApiProperty({
    description: 'Character description.',
    example: `Tobey “Bully” Maguire Spider-Man – "I’m gonna put some dirt in your eye." `,
  })
  @IsString()
  @MaxLength(500)
  @MinLength(10)
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'How should a character greet you?',
    example: 'I’m gonna put some dirt in your eye.',
  })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  greeting?: string;

  @ApiProperty({
    example: 'comedy,fictional',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Tags, { each: true })
  tags: Tags[];

  @ApiProperty({
    description: 'Choose between "public" or "private"',
    default: Visibility.PUBLIC,
  })
  @IsNotEmpty()
  @IsEnum(Visibility)
  visibility: Visibility = Visibility.PUBLIC;
}
