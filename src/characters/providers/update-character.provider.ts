import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from '../character.entity';
import { Repository } from 'typeorm';
import { User } from '../../users/user.entity';
import { S3Service } from '../../uploads/s3.service';
import { UpdateCharacterDto } from '../dtos/update-character.dto';
// import { extractS3KeyFromUrl } from 'src/uploads/utils/extractS3KeyFromUrl';

@Injectable()
export class UpdateCharacterProvider {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,

    @InjectRepository(User) private readonly userRepository: Repository<User>,

    private readonly s3Service: S3Service,
  ) {}

  async update(
    characterId: number,
    userId: number,
    updateCharacterDto: UpdateCharacterDto,
    file?: Express.Multer.File,
  ) {
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
        throw new NotFoundException('Character not found.');
      }

      if (character.creator.id !== userId) {
        throw new UnauthorizedException(
          'You are not authorized to update this character.',
        );
      }

      if (file) {
        // if (character.avatar) {
        //   const key = extractS3KeyFromUrl(character.avatar);
        //   if (key) await this.s3Service.deleteObject(key);
        // }

        const imageUrl = await this.s3Service.uploadSingleImage(
          'characters',
          file,
          userId,
        );
        updateCharacterDto.avatar = imageUrl;
      }

      Object.assign(character, updateCharacterDto);
      return await this.characterRepository.save(character);
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Failed to update character',
      );
    }
  }
}
