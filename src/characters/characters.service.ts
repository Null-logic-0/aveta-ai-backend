import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCharacterProvider } from './providers/create-character.provider';
import { Repository } from 'typeorm';
import { Character } from './character.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCharacterDto } from './dtos/create-character.dto';
import { UpdateCharacterProvider } from './providers/update-character.provider';
import { UpdateCharacterDto } from './dtos/update-character.dto';
import { DeleteCharacterProvider } from './providers/delete-character.provider';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,

    private readonly createCharacterProvider: CreateCharacterProvider,

    private readonly updateCharacterProvider: UpdateCharacterProvider,

    private readonly deleteCharacterProvider: DeleteCharacterProvider,
  ) {}

  async create(
    userId: number,
    createCharacterDto: CreateCharacterDto,
    file: Express.Multer.File,
  ) {
    return this.createCharacterProvider.create(
      userId,
      createCharacterDto,
      file,
    );
  }

  async update(
    characterId: number,
    userId: number,
    updateCharacterDto: UpdateCharacterDto,
    file?: Express.Multer.File,
  ) {
    return this.updateCharacterProvider.update(
      characterId,
      userId,
      updateCharacterDto,
      file,
    );
  }

  async getAll() {
    try {
      return this.characterRepository.find();
    } catch (error) {
      throw new BadRequestException(error || 'Failed to fetch characters!');
    }
  }

  async getOne(characterId: number) {
    try {
      const character = await this.characterRepository.findOneBy({
        id: characterId,
      });
      if (!character) {
        throw new NotFoundException('Oops...,Character not found!');
      }
      return character;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error || 'Oops something went wrong!');
    }
  }

  async delete(characterId: number, userId: number) {
    return this.deleteCharacterProvider.delete(characterId, userId);
  }
}
