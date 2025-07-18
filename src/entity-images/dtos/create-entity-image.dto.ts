import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EntityImageType } from '../enums/entity-images.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEntityImageDto {
  @ApiProperty({
    description: 'Upload image.',
    example: `[https://example.com/assets/image1.jpg`,
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'Image type.',
    example: 'avatar | theme',
  })
  @IsEnum(EntityImageType)
  @IsNotEmpty()
  type: EntityImageType;
}
