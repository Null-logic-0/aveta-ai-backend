import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { S3Service } from '../../uploads/s3.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { extractS3KeyFromUrl } from '../../uploads/utils/extractS3KeyFromUrl';

@Injectable()
export class UpdateUser {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,

    private readonly s3Service: S3Service,
  ) {}

  // private extractS3KeyFromUrl(url: string): string | null {
  //   try {
  //     const parsed = new URL(url);
  //     return decodeURIComponent(parsed.pathname.slice(1));
  //   } catch {
  //     return null;
  //   }
  // }

  async update(
    userId: number,
    attrs: Partial<User>,
    file?: Express.Multer.File,
  ) {
    try {
      const user = await this.usersRepository.findOneBy({
        id: userId,
      });
      if (!user) {
        throw new UnauthorizedException(
          'You are not logged in! Please login again.',
        );
      }
      if ('email' in attrs || 'password' in attrs) {
        throw new NotAcceptableException(
          'You cannot update email, password, or role here.',
        );
      }
      if (file) {
        if (user.profileImage) {
          const key = extractS3KeyFromUrl(user.profileImage);
          if (key) await this.s3Service.deleteObject(key);
        }

        const imageUrl = await this.s3Service.uploadSingleImage(
          'profile-images',
          file,
          userId,
        );
        attrs.profileImage = imageUrl;
      }

      Object.assign(user, attrs);
      return this.usersRepository.save(user);
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotAcceptableException
      ) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Invalid update');
    }
  }
}
