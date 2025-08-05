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
import { PaginationQueryDto } from '../common/pagination/dtos/pagination-query.dto';
import { PaginationProvider } from '../common/pagination/providers/pagination.provider';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,

    private readonly createBlogProvider: CreateBlogProvider,

    private readonly updateBlogProvider: UpdateBlogProvider,

    private readonly deleteBlogProvider: DeleteBlogProvider,

    private readonly paginationProvider: PaginationProvider,
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

  async getAllBlogs(paginateBlogs?: PaginationQueryDto) {
    try {
      const query = this.blogRepository
        .createQueryBuilder('blog')
        .orderBy('blog.createdAt', 'DESC');

      return await this.paginationProvider.paginateQuery(
        {
          limit: paginateBlogs?.limit,
          page: paginateBlogs?.page,
        },
        query,
      );
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Oops something went wrong!',
      );
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
      throw new BadRequestException(
        error.message || 'Oops something went wrong!',
      );
    }
  }

  async removeBlog(userId: number, blogId: number) {
    return this.deleteBlogProvider.delete(userId, blogId);
  }
}
