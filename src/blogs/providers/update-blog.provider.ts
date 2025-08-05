import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Blog } from '../blogs.entity';
import { User } from '../../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBlogDto } from '../dtos/update-blog.dto';
import { S3Service } from '../../uploads/s3.service';
import { extractS3KeyFromUrl } from '../../uploads/utils/extractS3KeyFromUrl';

@Injectable()
export class UpdateBlogProvider {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly s3Service: S3Service,
  ) {}

  async update(
    blogId: number,
    userId: number,
    updateBlogDto: UpdateBlogDto,
    file?: Express.Multer.File,
  ) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new UnauthorizedException(
          'Invalid credentials,Please sign-in again!',
        );
      }

      const blog = await this.blogRepository.findOne({
        where: { id: blogId },
      });

      if (!blog) {
        throw new NotFoundException('Blog not found.');
      }

      if (file) {
        if (blog.media) {
          const key = extractS3KeyFromUrl(blog.media);
          if (key) await this.s3Service.deleteObject(key);
        }

        const imageUrl = await this.s3Service.uploadSingleImage(
          'blogs',
          file,
          userId,
        );
        updateBlogDto.media = imageUrl;
      }

      Object.assign(blog, updateBlogDto);
      return await this.blogRepository.save(blog);
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to update blog');
    }
  }
}
