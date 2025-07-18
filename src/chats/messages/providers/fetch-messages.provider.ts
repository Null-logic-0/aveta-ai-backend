import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/chats/chat.entity';
import { Repository } from 'typeorm';
import { Message } from '../message.entity';

@Injectable()
export class FetchMessagesProvider {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async getAll(chatId: number) {
    try {
      const chat = await this.chatRepository.findOneBy({ id: chatId });
      if (!chat) {
        throw new NotFoundException('Chat not found!');
      }
      const messages = await this.messageRepository.find({
        where: { chat: { id: chatId } },
        relations: ['user', 'character'],
        order: { createdAt: 'ASC' },
      });

      return messages;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error || 'Oops... something went wrong!');
    }
  }
}
