import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

import OpenAI from 'openai';

import { User } from '../../../users/user.entity';
import { SendMessageDto } from '../dtos/send-message.dto';
import { Message } from '../message.entity';
import { Sender } from '../enums/sender.enum';
import { Chat } from 'src/chats/chat.entity';

@Injectable()
export class SendMessageProvider {
  private readonly openai: OpenAI;
  constructor(
    private configService: ConfigService,

    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,

    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('appConfig.openAIKey'),
    });
  }

  async create(userId: number, chatId: number, sendMessageDto: SendMessageDto) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new UnauthorizedException(
          'Invalid credentials,Please sign-in again!',
        );
      }

      const chat = await this.chatRepository.findOneBy({ id: chatId });
      if (!chat) {
        throw new NotFoundException('Chat not found!');
      }

      const userMessage = await this.messageRepository.save({
        content: sendMessageDto.content,
        role: Sender.USER,
        user,
        chat,
      });

      const aiResponse = await this.openai.chat.completions.create({
        model: 'o3-mini',
        messages: [
          {
            role: 'system',
            content: chat.character.tagline,
          },
          {
            role: 'user',
            content: sendMessageDto.content,
          },
        ],
      });
      const aiReply = aiResponse.choices[0].message.content || '';
      const aiMessage = await this.messageRepository.save({
        content: aiReply,
        role: Sender.AI,
        character: chat.character,
        chat,
      });
      return {
        userMessage,
        aiMessage,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new BadRequestException(error || 'Oops... Something went wrong!');
    }
  }
}
