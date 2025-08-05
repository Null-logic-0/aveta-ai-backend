import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    example: Role.Creator,
    enum: Role,
    description: 'User role',
  })
  @IsEnum(Role, {
    message: `Role must be one of the following values: ${Object.values(Role).join(', ')}`,
  })
  role?: Role;
}
