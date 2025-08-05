import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Blog } from '../blogs.entity';
import { S3Service } from '../../uploads/s3.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';
import { extractS3KeyFromUrl } from '../../uploads/utils/extractS3KeyFromUrl';

@Injectable()
export class DeleteBlogProvider {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,

    @InjectRepository(User) private readonly userRepository: Repository<User>,

    private readonly s3Service: S3Service,
  ) {}

  async delete(userId: number, blogId: number) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });

      if (!user) {
        throw new UnauthorizedException(
          'Invalid credentials,Please sign-in again!',
        );
      }
      const blog = await this.blogRepository.findOneBy({ id: blogId });

      if (!blog) {
        throw new NotFoundException('Blog with this ID not found!');
      }

      if (blog.media) {
        const key = extractS3KeyFromUrl(blog.media);
        if (key) {
          await this.s3Service.deleteObject(key);
        }
      }

      await this.blogRepository.remove(blog);
      return {
        deleted: true,
        message: 'Blog has been deleted successfully!',
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Oops something went wrong!',
      );
    }
  }
}
