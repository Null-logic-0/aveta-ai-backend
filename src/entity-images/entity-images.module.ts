import { Module } from '@nestjs/common';
import { EntityImagesService } from './entity-images.service';
import { EntityImagesController } from './entity-images.controller';
import { CreateEntityImageProvider } from './providers/create-entity-image.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { EntityImage } from './entity-image.entity';
import { S3Service } from 'src/uploads/s3.service';
import { DeleteEntityImageProvider } from './providers/delete-entity-image.provider';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User, EntityImage])],
  providers: [
    EntityImagesService,
    CreateEntityImageProvider,
    S3Service,
    DeleteEntityImageProvider,
    PaginationProvider,
  ],
  controllers: [EntityImagesController],
})
export class EntityImagesModule {}
