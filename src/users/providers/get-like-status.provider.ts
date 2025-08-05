import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { Character } from '../../characters/character.entity';

@Injectable()
export class GetLikeStatusProvider {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async getLikeStatus(characterId: number, userId: number) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException('User not found!');
      }

      const character = await this.characterRepository.findOne({
        where: { id: characterId },
        relations: ['likedByUsers'],
      });

      if (!character) {
        throw new NotFoundException('Character not found!');
      }

      const liked = character.likedByUsers.some((user) => user.id === userId);
      const likeCount = character.likedByUsers.length;
      return { liked, likeCount };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Oops...something went wrong!',
      );
    }
  }
}
