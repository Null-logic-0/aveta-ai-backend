import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from '../../characters/character.entity';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class ToggleLikeCharacterProvider {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async toggleLike(userId: number, characterId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['likedCharacters'],
      });
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

      const alreadyLiked = user.likedCharacters.some(
        (c) => c.id === character.id,
      );
      if (alreadyLiked) {
        user.likedCharacters = user.likedCharacters.filter(
          (c) => c.id !== character.id,
        );
      } else {
        user.likedCharacters.push(character);
      }
      await this.userRepository.save(user);

      const likeCount = await this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.likedCharacters', 'character')
        .where('character.id = :characterId', { characterId })
        .getCount();

      return { liked: !alreadyLiked, likeCount };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Oops...something went wrong!',
      );
    }
  }
}
