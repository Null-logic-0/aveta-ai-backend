import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CreateBlogDto } from './dtos/create-blog.dto';
import { GetActiveUser } from 'src/auth/decorators/getActiveUser';
import { ActiveUserData } from 'src/auth/interface/active-user.interface';
import { UpdateBlogDto } from './dtos/update-blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Fetch all blogs.',
  })
  async getAllBlogs(@Query() query: PaginationQueryDto) {
    const { limit, page } = query;
    return await this.blogsService.getAllBlogs({ limit, page });
  }

  @Get('/:blogId')
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Fetch single blog.',
  })
  async getSingleBlog(@Param('blogId') blogId: number) {
    return await this.blogsService.getSingleBlog(blogId);
  }

  @Post()
  @Auth(AuthType.Bearer)
  @Roles(Role.Admin || Role.Creator)
  @UseInterceptors(FileInterceptor('media'))
  @ApiOperation({
    summary: 'Blog creation allowed for Admins and Content Creators.',
  })
  async createBlog(
    @GetActiveUser() user: ActiveUserData,
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.blogsService.createBlog(user.sub, createBlogDto, file);
  }

  @Patch('/:blogId')
  @Auth(AuthType.Bearer)
  @UseInterceptors(FileInterceptor('media'))
  @Roles(Role.Admin || Role.Creator)
  @ApiOperation({
    summary: 'Blog update allowed for Admins and Content Creators.',
  })
  async updateBlog(
    @GetActiveUser() user: ActiveUserData,
    @Param('blogId') blogId: number,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.blogsService.updateBlog(
      blogId,
      user.sub,
      updateBlogDto,
      file,
    );
  }

  @Delete('/:blogId')
  @Auth(AuthType.Bearer)
  @Roles(Role.Admin || Role.Creator)
  @ApiOperation({
    summary: 'Blog deletion allowed for Admins and Content Creators.',
  })
  async deleteBlog(
    @GetActiveUser() user: ActiveUserData,
    @Param('blogId') blogId: number,
  ) {
    return await this.blogsService.removeBlog(user.sub, blogId);
  }
}
