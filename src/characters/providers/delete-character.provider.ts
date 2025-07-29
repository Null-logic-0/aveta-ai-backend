import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from '../character.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { S3Service } from 'src/uploads/s3.service';
// import { extractS3KeyFromUrl } from 'src/uploads/utils/extractS3KeyFromUrl';

@Injectable()
export class DeleteCharacterProvider {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,

    @InjectRepository(User) private readonly userRepository: Repository<User>,

    private readonly s3Service: S3Service,
  ) {}

  async delete(characterId: number, userId: number) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });

      if (!user) {
        throw new UnauthorizedException(
          'Invalid credentials,Please sign-in again!',
        );
      }
      const character = await this.characterRepository.findOne({
        where: { id: characterId },
        relations: ['creator'],
      });

      if (!character) {
        throw new NotFoundException('Character with this ID not found!');
      }

      if (character.creator.id !== userId) {
        throw new UnauthorizedException(
          'You are not authorized to update this character.',
        );
      }

      // if (character.avatar) {
      //   const key = extractS3KeyFromUrl(character.avatar);
      //   if (key) {
      //     await this.s3Service.deleteObject(key);
      //   }
      // }

      await this.characterRepository.remove(character);
      return {
        deleted: true,
        message: 'Character has been deleted successfully!',
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Oops something went wrong!',
      );
    }
  }
}
