import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Chat } from '../chat.entity';
import { User } from '../../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateChatThemeDto } from '../dtos/update-chat-theme.dto';

@Injectable()
export class UpdateChatThemeProvider {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
  ) {}

  async update(
    chatId: number,
    userId: number,
    updateChatThemeDto: UpdateChatThemeDto,
  ) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new UnauthorizedException(
          'Invalid credentials,Please sign-in again!',
        );
      }

      const chat = await this.chatRepository.findOneBy({
        id: chatId,
      });

      if (!chat) {
        throw new NotFoundException(
          'Chat not found for this character and user.',
        );
      }

      chat.theme = updateChatThemeDto.theme;

      await this.chatRepository.save(chat);

      return {
        updated: true,
        message: 'Chat theme updated successfully!',
        chat,
      };
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
