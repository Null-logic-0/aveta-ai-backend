import { ApiOperation } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dtos/send-message.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthType } from '../../auth/enums/auth-type.enum';
import { GetActiveUser } from '../../auth/decorators/getActiveUser';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ActiveUserData } from '../../auth/interface/active-user.interface';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('/:chatId')
  @Auth(AuthType.Bearer)
  @ApiOperation({
    summary: 'Fetch all messages.',
  })
  async getAllMessages(@Param('chatId') chatId: number) {
    return await this.messagesService.getAll(chatId);
  }

  @Post('/:chatId')
  @Auth(AuthType.Bearer)
  @ApiOperation({
    summary: 'Send message.',
  })
  async sendMessage(
    @Param('chatId') chatId: number,
    @GetActiveUser() user: ActiveUserData,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return await this.messagesService.create(user.sub, chatId, sendMessageDto);
  }
}
