import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EntityImagesService } from './entity-images.service';
import { GetActiveUser } from '../auth/decorators/getActiveUser';
import { ActiveUserData } from '../auth/interface/active-user.interface';
import { CreateEntityImageDto } from './dtos/create-entity-image.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { PaginateEntityImageDto } from './dtos/paginate-entity-image.dto';

@Controller('entity-images')
export class EntityImagesController {
  constructor(private readonly entityImagesService: EntityImagesService) {}

  @Post()
  @Auth(AuthType.Bearer)
  @Roles(Role.Admin || Role.Creator)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Upload assets by admin or creator for app.',
  })
  async createAssets(
    @GetActiveUser() user: ActiveUserData,
    @Body() createEntityImageDto: CreateEntityImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.entityImagesService.create(
      user.sub,
      createEntityImageDto,
      file,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Fetch all images.',
  })
  @Auth(AuthType.Bearer)
  async getAllImages(@Query() query: PaginateEntityImageDto) {
    const { limit, page, ...type } = query;
    return await this.entityImagesService.getAll(type.type, { limit, page });
  }

  @Delete('/:imageId')
  @ApiOperation({
    summary: 'Delete image by admin or creator.',
  })
  @Auth(AuthType.Bearer)
  @Roles(Role.Admin || Role.Creator)
  async deleteImage(
    @GetActiveUser() user: ActiveUserData,
    @Param('imageId') imageId: number,
  ) {
    return await this.entityImagesService.delete(user.sub, imageId);
  }
}
