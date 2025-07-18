import { BadRequestException, Injectable } from '@nestjs/common';
import { SendMessageProvider } from './providers/send-message.provider';
import { SendMessageDto } from './dtos/send-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { FetchMessagesProvider } from './providers/fetch-messages.provider';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    private readonly sendMessageProvider: SendMessageProvider,

    private readonly fetchMessagesProvider: FetchMessagesProvider,
  ) {}

  create(userId: number, chatId: number, sendMessageDto: SendMessageDto) {
    return this.sendMessageProvider.create(userId, chatId, sendMessageDto);
  }

  async getAll(chatId: number) {
    try {
      return await this.fetchMessagesProvider.getAll(chatId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
