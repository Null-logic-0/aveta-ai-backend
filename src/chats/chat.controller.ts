import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthType } from '../auth/enums/auth-type.enum';
import { CreateChatDto } from './dtos/create-chat.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetActiveUser } from '../auth/decorators/getActiveUser';
import { UpdateChatThemeDto } from './dtos/update-chat-theme.dto';
import { ActiveUserData } from '../auth/interface/active-user.interface';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @Auth(AuthType.Bearer)
  @ApiOperation({
    summary: 'Fetch all chats!',
  })
  async getAllChat(@GetActiveUser() user: ActiveUserData) {
    return await this.chatService.getAll(user.sub);
  }

  @Get('/:chatId')
  @Auth(AuthType.Bearer)
  @ApiOperation({
    summary: 'Fetch single chat!',
  })
  async getChat(@Param('chatId') chatId: number) {
    return await this.chatService.getOne(chatId);
  }

  @Post('/:characterId')
  @Auth(AuthType.Bearer)
  @ApiOperation({
    summary: 'Create chat with your desire character!',
  })
  async createChat(
    @Param('characterId') characterId: number,
    @GetActiveUser() user: ActiveUserData,
    @Body() createChatDto: CreateChatDto,
  ) {
    return await this.chatService.create(characterId, user.sub, createChatDto);
  }

  @Patch('/:chatId')
  @Auth(AuthType.Bearer)
  @ApiOperation({
    summary: 'Update chat theme.',
  })
  async UpdateChatTheme(
    @Param('chatId') chatId: number,
    @GetActiveUser() user: ActiveUserData,
    @Body() updateChatThemeDto: UpdateChatThemeDto,
  ) {
    return await this.chatService.update(chatId, user.sub, updateChatThemeDto);
  }

  @Delete('/:chatId')
  @Auth(AuthType.Bearer)
  @ApiOperation({
    summary: 'Delete chat!',
  })
  async deleteChat(
    @Param('chatId') chatId: number,
    @GetActiveUser() user: ActiveUserData,
  ) {
    return await this.chatService.delete(user.sub, chatId);
  }
}
