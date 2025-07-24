import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GoogleTokenDto {
  @ApiProperty({
    description: 'Use google account to sign-up.',
  })
  @IsNotEmpty()
  token: string;
}
