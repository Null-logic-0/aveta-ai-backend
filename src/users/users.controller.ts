import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApiOperation } from '@nestjs/swagger';
import { GetActiveUser } from 'src/auth/decorators/getActiveUser';
import { ActiveUserData } from 'src/auth/interface/active-user.interface';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';
import { UpdateUserProfileDto } from './dtos/update-user-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Admin and Creator Routes

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Fetch all users.',
  })
  getAllUsers(@GetActiveUser() user: ActiveUserData) {
    return this.usersService.getAll(user.sub);
  }

  @Patch('update-role/:id')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Update any user role by admin.',
  })
  updateUserRole(
    @Param('id') id: number,
    @Body() updateUserRole: UpdateUserRoleDto,
  ) {
    return this.usersService.updateUserRole(id, updateUserRole);
  }

  @Patch('toggleBlock-user/:id')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Block/Unblock any user by admin.',
  })
  toggleBlockUser(@Param('id') id: number) {
    return this.usersService.toggleBlockUser(id);
  }

  @Delete('delete-user/:id')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Delete any user by admin.',
  })
  deleteUser(@Param('id') id: number) {
    return this.usersService.removeUser(id);
  }

  // Current logged-in user routes

  @Get('/me/profile')
  @ApiOperation({
    summary: 'Fetch current logged-in user profile.',
  })
  async getCurrentUser(@GetActiveUser() user: ActiveUserData) {
    return this.usersService.getOne(user.sub);
  }

  @Get('user/:id')
  @ApiOperation({
    summary: 'Fetch single user.',
  })
  getSingleUser(@Param('id') id: number) {
    return this.usersService.getOne(id);
  }

  @Patch('/me/update-profile')
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiOperation({
    summary: 'Update current logged-in user profile.',
  })
  async updateProfile(
    @GetActiveUser() user: ActiveUserData,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.usersService.updateProfile(
      user.sub,
      updateUserProfileDto,
      file,
    );
  }

  @Delete('/me/delete-account')
  @ApiOperation({
    summary: 'Delete account!',
  })
  async deleteAccount(@GetActiveUser() user: ActiveUserData) {
    return this.usersService.deleteAccount(user.sub);
  }
}
