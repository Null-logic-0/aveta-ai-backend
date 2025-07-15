import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({
    description: 'User name.',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty({
    description: 'User profile image.',
    example: 'https://example.com/profile-image/profile.png',
  })
  @IsString()
  @IsOptional()
  profileImage?: string;
}
