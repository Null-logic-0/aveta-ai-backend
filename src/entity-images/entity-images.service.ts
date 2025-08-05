import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityImage } from './entity-image.entity';
import { EntityImageType } from './enums/entity-images.enum';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEntityImageDto } from './dtos/create-entity-image.dto';
import { PaginateEntityImageDto } from './dtos/paginate-entity-image.dto';
import { CreateEntityImageProvider } from './providers/create-entity-image.provider';
import { DeleteEntityImageProvider } from './providers/delete-entity-image.provider';
import { PaginationProvider } from '../common/pagination/providers/pagination.provider';

@Injectable()
export class EntityImagesService {
  constructor(
    @InjectRepository(EntityImage)
    private readonly entityImageRepository: Repository<EntityImage>,
    private readonly createEntityImageProvider: CreateEntityImageProvider,
    private readonly deleteEntityImageProvider: DeleteEntityImageProvider,
    private readonly paginationProvider: PaginationProvider,
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

  async getAll(
    type?: EntityImageType,
    paginateEntityImage?: PaginateEntityImageDto,
  ) {
    try {
      const query = this.entityImageRepository.createQueryBuilder('imageType');
      if (type) {
        query.andWhere('imageType.type = :type', { type });
      }
      query.orderBy('imageType.id', 'DESC');

      return await this.paginationProvider.paginateQuery(
        {
          limit: paginateEntityImage?.limit,
          page: paginateEntityImage?.page,
        },
        query,
      );
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Oops...something went wrong!',
      );
    }
  }

  async delete(userId: number, imageId: number) {
    return await this.deleteEntityImageProvider.delete(userId, imageId);
  }
}
