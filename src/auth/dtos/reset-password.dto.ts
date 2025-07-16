import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { PasswordMatch } from '../decorators/passwordMatch.decorator';

export class ResetPasswordDto {
  @ApiProperty({
    description: "User's new password",
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
