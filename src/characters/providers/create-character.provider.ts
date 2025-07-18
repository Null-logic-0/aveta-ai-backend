import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Character } from '../character.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';
import { CreateCharacterDto } from '../dtos/create-character.dto';
import { S3Service } from '../../uploads/s3.service';

@Injectable()
export class CreateCharacterProvider {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,

    @InjectRepository(User) private readonly userRepository: Repository<User>,

    private readonly s3Service: S3Service,
  ) {}

  async create(
    userId: number,
    createCharacterDto: CreateCharacterDto,
    file: Express.Multer.File,
  ) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });

      if (!user) {
        throw new UnauthorizedException(
          'Invalid credentials,Please sign-in again!',
        );
      }

      if (file) {
        const imageUrl = await this.s3Service.uploadSingleImage(
          'characters',
          file,
          userId,
        );
        createCharacterDto.avatar = imageUrl;
      }

      const character = this.characterRepository.create({
        ...createCharacterDto,
        creator: user,
      });
      return await this.characterRepository.save(character);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(error || 'Oops something went wrong!');
    }
  }
}
