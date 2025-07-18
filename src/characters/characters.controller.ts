import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CharactersService } from './characters.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetActiveUser } from 'src/auth/decorators/getActiveUser';
import { ActiveUserData } from 'src/auth/interface/active-user.interface';
import { CreateCharacterDto } from './dtos/create-character.dto';
import { UpdateCharacterDto } from './dtos/update-character.dto';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Fetch all characters.',
  })
  async getAllCharacters() {
    return this.charactersService.getAll();
  }

  @Get('/:characterId')
  @Auth(AuthType.Bearer)
  @ApiOperation({
    summary: 'Fetch single character.',
  })
  async getSingleCharacter(@Param('characterId') characterId: number) {
    return this.charactersService.getOne(characterId);
  }

  @Post()
  @Auth(AuthType.Bearer)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({
    summary: 'Create character.',
  })
  async createCharacter(
    @GetActiveUser() user: ActiveUserData,
    @Body() createCharacterDto: CreateCharacterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.charactersService.create(user.sub, createCharacterDto, file);
  }

  @Patch('/:characterId')
  @Auth(AuthType.Bearer)
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
    return this.charactersService.update(
      characterId,
      user.sub,
      updateCharacterDto,
      file,
    );
  }

  @Delete('/:characterId')
  @Auth(AuthType.Bearer)
  @ApiOperation({
    summary: 'Delete character.',
  })
  async deleteCharacter(
    @Param('characterId') characterId: number,
    @GetActiveUser() user: ActiveUserData,
  ) {
    return this.charactersService.delete(characterId, user.sub);
  }
}
