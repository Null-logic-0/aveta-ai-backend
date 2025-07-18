import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessagesController } from './messages.controller';
import { SendMessageProvider } from './providers/send-message.provider';
import { User } from '../../users/user.entity';
import { Message } from './message.entity';
import { Chat } from '../chat.entity';
import { FetchMessagesProvider } from './providers/fetch-messages.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User, Message])],
  providers: [MessagesService, SendMessageProvider, FetchMessagesProvider],
  controllers: [MessagesController],
})
export class MessagesModule {}
