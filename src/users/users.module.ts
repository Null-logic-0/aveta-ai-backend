import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from '../auth/auth.module';
import { FindByEmailProvider } from './providers/find-by-email-provider';
import { UpdateUser } from './providers/update-user.provider';
import { S3Service } from 'src/uploads/s3.service';
import { ToggleLikeCharacterProvider } from './providers/toggle-like-character.provider';
import { Character } from 'src/characters/character.entity';
import { FetchUserCreatedCharactersProvider } from './providers/fetch-user-created-characters.provider';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { FetchUserLikedCharactersProvider } from './providers/fetch-user-liked-characters.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Character]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    UsersService,
    FindByEmailProvider,
    UpdateUser,
    S3Service,
    ToggleLikeCharacterProvider,
    FetchUserCreatedCharactersProvider,
    PaginationProvider,
    FetchUserLikedCharactersProvider,
  ],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
