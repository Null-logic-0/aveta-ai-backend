import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: "User's email address.",
    example: 'mark@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;
}
