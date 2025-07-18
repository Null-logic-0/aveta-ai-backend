import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ApiOperation } from '@nestjs/swagger';
import { GetActiveUser } from 'src/auth/decorators/getActiveUser';
import { ActiveUserData } from 'src/auth/interface/active-user.interface';
import { SendMessageDto } from './dtos/send-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('/:chatId')
  @Auth(AuthType.Bearer)
  @ApiOperation({
    summary: 'Fetch all messages.',
  })
  getAllMessages(@Param('chatId') chatId: number) {
    return this.messagesService.getAll(chatId);
  }

  @Post('/:chatId')
  @Auth(AuthType.Bearer)
  @ApiOperation({
    summary: 'Send message.',
  })
  sendMessage(
    @Param('chatId') chatId: number,
    @GetActiveUser() user: ActiveUserData,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.messagesService.create(user.sub, chatId, sendMessageDto);
  }
}
