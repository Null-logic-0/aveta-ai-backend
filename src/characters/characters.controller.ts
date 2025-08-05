import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CharactersService } from './characters.service';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetActiveUser } from '../auth/decorators/getActiveUser';
import { ActiveUserData } from '../auth/interface/active-user.interface';
import { CreateCharacterDto } from './dtos/create-character.dto';
import { UpdateCharacterDto } from './dtos/update-character.dto';
import { PaginateCharacterDto } from './dtos/paginate-character.dto';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch all characters.',
  })
  async getAllCharacters(@Query() query: PaginateCharacterDto) {
    const { limit, page, ...filters } = query;

    return await this.charactersService.getAll(filters, { limit, page });
  }

  @Get('/:characterId')
  @ApiOperation({
    summary: 'Fetch single character.',
  })
  async getSingleCharacter(
    @Param('characterId') characterId: number,
    @GetActiveUser() user: ActiveUserData,
  ) {
    return await this.charactersService.getOne(characterId, user.sub);
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({
    summary: 'Create character.',
  })
  async createCharacter(
    @GetActiveUser() user: ActiveUserData,
    @Body() createCharacterDto: CreateCharacterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.charactersService.create(
      user.sub,
      createCharacterDto,
      file,
    );
  }

  @Patch('/:characterId')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({
    summary: 'Update character.',
  })
  async updateCharacter(
    @Param('characterId') characterId: number,
    @GetActiveUser() user: ActiveUserData,
    @Body() updateCharacterDto: UpdateCharacterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.charactersService.update(
      characterId,
      user.sub,
      updateCharacterDto,
      file,
    );
  }

  @Delete('/:characterId')
  @ApiOperation({
    summary: 'Delete character.',
  })
  async deleteCharacter(
    @Param('characterId') characterId: number,
    @GetActiveUser() user: ActiveUserData,
  ) {
    return await this.charactersService.delete(characterId, user.sub);
  }
}
