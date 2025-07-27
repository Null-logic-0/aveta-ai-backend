import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEntityImageProvider } from './providers/create-entity-image.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityImage } from './entity-image.entity';
import { Repository } from 'typeorm';
import { CreateEntityImageDto } from './dtos/create-entity-image.dto';
import { EntityImageType } from './enums/entity-images.enum';
import { DeleteEntityImageProvider } from './providers/delete-entity-image.provider';

@Injectable()
export class EntityImagesService {
  constructor(
    @InjectRepository(EntityImage)
    private readonly entityImageRepository: Repository<EntityImage>,
    private readonly createEntityImageProvider: CreateEntityImageProvider,
    private readonly deleteEntityImageProvider: DeleteEntityImageProvider,
  ) {}

  async create(
    userId: number,
    createEntityImageDto: CreateEntityImageDto,
    file: Express.Multer.File,
  ) {
    return await this.createEntityImageProvider.create(
      userId,
      createEntityImageDto,
      file,
    );
  }

  async getAll(type?: EntityImageType) {
    try {
      const query = this.entityImageRepository.createQueryBuilder('imageType');
      if (type) {
        query.andWhere('imageType.type = :type', { type });
      }
      query.orderBy('imageType.id', 'DESC');
      return await query.getMany();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async delete(userId: number, imageId: number) {
    return await this.deleteEntityImageProvider.delete(userId, imageId);
  }
}
