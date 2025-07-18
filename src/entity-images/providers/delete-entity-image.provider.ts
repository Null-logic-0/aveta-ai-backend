import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { S3Service } from 'src/uploads/s3.service';
import { Repository } from 'typeorm';
import { EntityImage } from '../entity-image.entity';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { extractS3KeyFromUrl } from 'src/uploads/utils/extractS3KeyFromUrl';

@Injectable()
export class DeleteEntityImageProvider {
  constructor(
    @InjectRepository(EntityImage)
    private readonly entityImageRepository: Repository<EntityImage>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly s3Service: S3Service,
  ) {}

  async delete(userId: number, imageId: number) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });

      if (!user) {
        throw new UnauthorizedException(
          'Invalid credentials,Please sign-in again!',
        );
      }
      const image = await this.entityImageRepository.findOneBy({
        id: imageId,
      });

      if (!image) {
        throw new NotFoundException('Image with this ID not found!');
      }

      if (image.image) {
        const key = extractS3KeyFromUrl(image.image);
        if (key) {
          await this.s3Service.deleteObject(key);
        }
      }

      await this.entityImageRepository.remove(image);
      return {
        deleted: true,
        message: 'Image has been deleted successfully!',
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(error || 'Oops something went wrong!');
    }
  }
}
