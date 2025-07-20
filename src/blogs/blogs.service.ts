import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Blog } from './blogs.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateBlogDto } from './dtos/create-blog.dto';
import { UpdateBlogDto } from './dtos/update-blog.dto';
import { CreateBlogProvider } from './providers/create-blog.provider';
import { UpdateBlogProvider } from './providers/update-blog.provider';
import { DeleteBlogProvider } from './providers/delete-blog.provider';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,

    private readonly createBlogProvider: CreateBlogProvider,

    private readonly updateBlogProvider: UpdateBlogProvider,

    private readonly deleteBlogProvider: DeleteBlogProvider,
  ) {}

  async createBlog(
    userId: number,
    createBlogDto: CreateBlogDto,
    file: Express.Multer.File,
  ) {
    return this.createBlogProvider.create(userId, createBlogDto, file);
  }

  async updateBlog(
    blogId: number,
    userId: number,
    updateBlogDto: UpdateBlogDto,
    file?: Express.Multer.File,
  ) {
    return this.updateBlogProvider.update(blogId, userId, updateBlogDto, file);
  }

  async getAllBlogs() {
    try {
      return this.blogRepository.find({ order: { createdAt: 'DESC' } });
    } catch (error) {
      throw new BadRequestException(error || 'Oops something went wrong!');
    }
  }

  async getSingleBlog(blogId: number) {
    try {
      const blog = await this.blogRepository.findOneBy({ id: blogId });
      if (!blog) {
        throw new NotFoundException('Blog not found!');
      }
      return blog;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error || 'Oops something went wrong!');
    }
  }

  async removeBlog(userId: number, blogId: number) {
    return this.deleteBlogProvider.delete(userId, blogId);
  }
}
