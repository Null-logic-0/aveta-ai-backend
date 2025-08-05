import { Module } from '@nestjs/common';
import { Blog } from './blogs.entity';
import { User } from '../users/user.entity';
import { BlogsService } from './blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from '../uploads/s3.service';
import { BlogsController } from './blogs.controller';
import { CreateBlogProvider } from './providers/create-blog.provider';
import { UpdateBlogProvider } from './providers/update-blog.provider';
import { DeleteBlogProvider } from './providers/delete-blog.provider';
import { PaginationProvider } from '../common/pagination/providers/pagination.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, User])],
  providers: [
    BlogsService,
    S3Service,
    CreateBlogProvider,
    UpdateBlogProvider,
    DeleteBlogProvider,
    PaginationProvider,
  ],
  controllers: [BlogsController],
})
export class BlogsModule {}
