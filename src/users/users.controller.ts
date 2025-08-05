import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Role } from '../auth/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetActiveUser } from '../auth/decorators/getActiveUser';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';
import { UpdateUserProfileDto } from './dtos/update-user-profile.dto';
import { ActiveUserData } from '../auth/interface/active-user.interface';
import { PaginationQueryDto } from '../common/pagination/dtos/pagination-query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Admin and Creator Routes

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Fetch all users.',
  })
  async getAllUsers(@GetActiveUser() user: ActiveUserData) {
    return await this.usersService.getAll(user.sub);
  }

  @Patch('update-role/:id')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Update any user role by admin.',
  })
  async updateUserRole(
    @Param('id') id: number,
    @Body() updateUserRole: UpdateUserRoleDto,
  ) {
    return await this.usersService.updateUserRole(id, updateUserRole);
  }

  @Patch('toggle-block-user/:id')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Block/Unblock any user by admin.',
  })
  async toggleBlockUser(@Param('id') id: number) {
    return await this.usersService.toggleBlockUser(id);
  }

  @Delete('delete-user/:id')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Delete any user by admin.',
  })
  async deleteUser(@Param('id') id: number) {
    return await this.usersService.removeUser(id);
  }

  // Current logged-in user routes

  @Get('/me/profile')
  @ApiOperation({
    summary: 'Fetch current logged-in user profile.',
  })
  async getCurrentUser(@GetActiveUser() user: ActiveUserData) {
    const foundUser = user.googleId
      ? await this.usersService.findOneByGoogleId(user.googleId)
      : await this.usersService.getOne(user.sub);

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return await this.usersService.getOne(user.sub);
  }

  @Get('user/:id')
  @ApiOperation({
    summary: 'Fetch single user.',
  })
  async getSingleUser(@Param('id') id: number) {
    return await this.usersService.getOne(id);
  }

  @Get('/me/my-characters')
  @ApiOperation({
    summary:
      'Fetch all characters created by the current logged-in user or another user.',
  })
  async getAllUserCharacters(
    @GetActiveUser() requestUserId: ActiveUserData,
    @Query() query: PaginationQueryDto & { targetUserId?: string },
  ) {
    const { limit, page, targetUserId } = query;
    const parsedTargetUserId = targetUserId
      ? parseInt(targetUserId, 10)
      : requestUserId.sub;

    if (isNaN(parsedTargetUserId)) {
      throw new BadRequestException('Invalid targetUserId');
    }
    return await this.usersService.getAllUserCharacters(
      requestUserId.sub,
      {
        limit,
        page,
      },
      parsedTargetUserId,
    );
  }

  @Get('/me/liked-characters')
  @ApiOperation({
    summary: 'Fetch all liked characters  by the current logged-in user.',
  })
  async getLikedCharactersByUser(
    @GetActiveUser() requestUserId: ActiveUserData,
    @Query() query: PaginationQueryDto & { targetUserId?: string },
  ) {
    const { limit, page, targetUserId } = query;
    const parsedTargetUserId = targetUserId
      ? parseInt(targetUserId, 10)
      : requestUserId.sub;

    if (isNaN(parsedTargetUserId)) {
      throw new BadRequestException('Invalid targetUserId');
    }
    return await this.usersService.getLikedCharactersByUser(
      requestUserId.sub,
      {
        limit,
        page,
      },
      parsedTargetUserId,
    );
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
    return await this.usersService.updateProfile(
      user.sub,
      updateUserProfileDto,
      file,
    );
  }

  @Post('like-character/:characterId')
  @ApiOperation({
    summary: 'Like/Unlike character',
  })
  async toggleLike(
    @GetActiveUser() user: ActiveUserData,
    @Param('characterId') characterId: number,
  ) {
    return await this.usersService.toggleLike(user.sub, characterId);
  }

  @Get('like-character/:characterId')
  @ApiOperation({
    summary: 'Fetch liked character by user',
  })
  async getLikeStatus(
    @Param('characterId') characterId: number,
    @GetActiveUser() user: ActiveUserData,
  ) {
    return await this.usersService.getLikeStatus(characterId, user.sub);
  }

  @Delete('/me/delete-account')
  @ApiOperation({
    summary: 'Delete account!',
  })
  async deleteAccount(@GetActiveUser() user: ActiveUserData) {
    return await this.usersService.deleteAccount(user.sub);
  }
}
