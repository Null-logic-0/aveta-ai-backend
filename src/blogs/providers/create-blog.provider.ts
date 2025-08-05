import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Blog } from '../blogs.entity';
import { User } from '../../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from '../../uploads/s3.service';
import { CreateBlogDto } from '../dtos/create-blog.dto';

@Injectable()
export class CreateBlogProvider {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    userId: number,
    createBlogDto: CreateBlogDto,
    file: Express.Multer.File,
  ) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new UnauthorizedException(
          'Invalid credentials,Please sign-in again!',
        );
      }
      if (file) {
        const imageUrl = await this.s3Service.uploadSingleImage(
          'blogs',
          file,
          userId,
        );
        createBlogDto.media = imageUrl;
      }

      const blog = this.blogRepository.create({
        ...createBlogDto,
        creator: user,
      });
      return await this.blogRepository.save(blog);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Oops something went wrong!',
      );
    }
  }
}
