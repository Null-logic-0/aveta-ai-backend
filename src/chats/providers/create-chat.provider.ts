import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Chat } from '../chat.entity';
import { User } from '../../users/user.entity';
import { Character } from '../../characters/character.entity';
import { CreateChatDto } from '../dtos/create-chat.dto';

@Injectable()
export class CreateChatProvider {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,

    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async create(
    characterId: number,
    userId: number,
    createChatDto: CreateChatDto,
  ) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new UnauthorizedException(
          'Invalid credentials,Please sign-in again!',
        );
      }

      const character = await this.characterRepository.findOneBy({
        id: characterId,
      });

      if (!character) {
        throw new NotFoundException('Character not found!');
      }

      const existingChat = await this.chatRepository.findOne({
        where: {
          user: { id: userId },
          character: { id: characterId },
        },
        relations: ['user', 'character'],
      });

      if (existingChat) {
        return { greeting: character.greeting, chat: existingChat };
      }

      const theme = createChatDto.theme ?? undefined;
      const newChat = this.chatRepository.create({
        user,
        character,
        theme,
      });

      const chat = await this.chatRepository.save(newChat);

      return { greeting: character.greeting, chat };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Oops something went wrong!',
      );
    }
  }
}
