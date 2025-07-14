import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PasswordMatch } from '../decorators/passwordMatch.decorator';
import { Role } from '../enums/role.enum';

export class SignUpDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  userName: string;

  @ApiProperty({
    description: 'The user email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Users password',
    example: 'John1234$',
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/, {
    message:
      'Password must contain at least one special character and be 6+ characters long',
  })
  password: string;
  @ApiProperty({
    description: 'Users password',
    example: 'John1234$',
  })
  @ApiProperty({
    description: 'Confirm password',
    example: 'John1234$',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @PasswordMatch('password', { message: 'Passwords do not match' })
  passwordConfirm: string;

  @IsOptional()
  @IsEnum(Role)
  readonly role?: Role;
}
