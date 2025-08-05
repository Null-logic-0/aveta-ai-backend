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

@Injectable()
export class DeleteChatProvider {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
  ) {}

  async delete(userId: number, chatId: number) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new UnauthorizedException(
          'Invalid credentials,Please sign-in again!',
        );
      }
      const chat = await this.chatRepository.findOne({
        where: {
          id: chatId,
          user: { id: userId },
        },
        relations: ['user'],
      });

      if (!chat) {
        throw new NotFoundException('Chat not found!');
      }

      await this.chatRepository.remove(chat);
      return {
        deleted: true,
        message: 'Chat has been deleted successfully!',
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
