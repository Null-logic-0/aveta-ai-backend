import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChatDto } from './dtos/create-chat.dto';
import { UpdateChatThemeDto } from './dtos/update-chat-theme.dto';
import { CreateChatProvider } from './providers/create-chat.provider';
import { DeleteChatProvider } from './providers/delete-chat.provider';
import { UpdateChatThemeProvider } from './providers/update-chat-theme.provider';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,

    private readonly createChatProvider: CreateChatProvider,

    private readonly updateChatThemeProvider: UpdateChatThemeProvider,

    private readonly deleteChatProvider: DeleteChatProvider,
  ) {}

  async create(
    characterId: number,
    userId: number,
    createChatDto: CreateChatDto,
  ) {
    return this.createChatProvider.create(characterId, userId, createChatDto);
  }

  async update(
    chatId: number,
    userId: number,
    updateChatThemeDto: UpdateChatThemeDto,
  ) {
    return this.updateChatThemeProvider.update(
      chatId,
      userId,
      updateChatThemeDto,
    );
  }

  async getOne(chatId: number) {
    try {
      const chat = await this.chatRepository.findOneBy({ id: chatId });
      if (!chat) {
        throw new NotFoundException('Chat not found!');
      }
      return {
        greeting: chat?.character.greeting,
        chat,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Error occurred!');
    }
  }

  async getAll(userId: number) {
    try {
      return await this.chatRepository.find({
        where: { user: { id: userId } },
        relations: ['character'],
        order: { updatedAt: 'DESC' },
      });
    } catch (error) {
      throw new BadRequestException(error.message || 'Error occurred!');
    }
  }

  async delete(userId: number, chatId: number) {
    return this.deleteChatProvider.delete(userId, chatId);
  }
}
