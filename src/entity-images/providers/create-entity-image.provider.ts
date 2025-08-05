import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityImage } from '../entity-image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';
import { CreateEntityImageDto } from '../dtos/create-entity-image.dto';
import { S3Service } from '../../uploads/s3.service';

@Injectable()
export class CreateEntityImageProvider {
  constructor(
    @InjectRepository(EntityImage)
    private readonly entityImageRepository: Repository<EntityImage>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly s3Service: S3Service,
  ) {}

  async create(
    userId: number,
    createEntityImageDto: CreateEntityImageDto,
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
          'assets',
          file,
          userId,
        );
        createEntityImageDto.image = imageUrl;
      }

      const assets = this.entityImageRepository.create(createEntityImageDto);
      await this.entityImageRepository.save(assets);
      return {
        assets,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException(
        error.message || 'Oops... something went wrong!',
      );
    }
  }
}
