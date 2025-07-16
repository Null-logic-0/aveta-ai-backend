import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { Blog } from './blogs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { S3Service } from 'src/uploads/s3.service';
import { CreateBlogProvider } from './providers/create-blog.provider';
import { UpdateBlogProvider } from './providers/update-blog.provider';
import { DeleteBlogProvider } from './providers/delete-blog.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, User])],
  providers: [BlogsService, S3Service, CreateBlogProvider, UpdateBlogProvider, DeleteBlogProvider],
  controllers: [BlogsController],
})
export class BlogsModule {}
