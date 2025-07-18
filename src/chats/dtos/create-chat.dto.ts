import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    description:
      'Optional theme of the conversation (e.g., romantic, philosophical, etc).',
    example: 'romantic',
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  theme?: string;
}
