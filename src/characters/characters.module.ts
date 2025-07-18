import { Module } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Character } from './character.entity';
import { CreateCharacterProvider } from './providers/create-character.provider';
import { S3Service } from '../uploads/s3.service';
import { UpdateCharacterProvider } from './providers/update-character.provider';
import { DeleteCharacterProvider } from './providers/delete-character.provider';
import { Chat } from '../chats/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Character, Chat])],
  providers: [
    CharactersService,
    CreateCharacterProvider,
    S3Service,
    UpdateCharacterProvider,
    DeleteCharacterProvider,
  ],
  controllers: [CharactersController],
})
export class CharactersModule {}
