import { Body, Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Get all users.',
  })
  getAllUsers() {
    return this.usersService.getAll();
  }

  @Get('/:id')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Get single user.',
  })
  getSingleUser(@Param('id') id: number) {
    return this.usersService.getOne(id);
  }
}
