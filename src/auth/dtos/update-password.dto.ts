import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { PasswordMatch } from '../decorators/passwordMatch.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    description: "Current logged-in user's password",
    example: 'John1234$',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: "Current logged-in user's new password",
    example: 'Mark1234$',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/, {
    message:
      'Password must contain at least one special character and be 6+ characters long',
  })
  newPassword: string;

  @ApiProperty({
    description: 'Confirm new password',
    example: 'Mark1234$',
  })
  @IsString()
  @IsNotEmpty()
  @PasswordMatch('newPassword', { message: 'Passwords do not match' })
  confirmPassword: string;
}
