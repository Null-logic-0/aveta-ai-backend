import { Body, Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApiOperation } from '@nestjs/swagger';
import { GetActiveUser } from 'src/auth/decorators/getActiveUser';
import { ActiveUserData } from 'src/auth/interface/active-user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Admin and Creator Routes

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Get all users.',
  })
  getAllUsers(@GetActiveUser() user: ActiveUserData) {
    return this.usersService.getAll(user.sub);
  }

  @Get('/user/:id')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Get single user.',
  })
  getSingleUser(@Param('id') id: number) {
    return this.usersService.getOne(id);
  }

  // Current logged-in user routes

  @Get('/me/profile')
  @ApiOperation({
    summary: 'Fetch current logged-in user profile.',
  })
  async getCurrentUser(@GetActiveUser() user: ActiveUserData) {
    return this.usersService.getOne(user.sub);
  }
}
