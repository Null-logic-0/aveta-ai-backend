import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Character } from '../characters/character.entity';
import { CreateChatProvider } from './providers/create-chat.provider';
import { Chat } from './chat.entity';
import { Message } from './messages/message.entity';
import { MessagesModule } from './messages/messages.module';
import { DeleteChatProvider } from './providers/delete-chat.provider';
import { UpdateChatThemeProvider } from './providers/update-chat-theme.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Character, Chat, Message]),
    MessagesModule,
  ],
  providers: [
    ChatService,
    CreateChatProvider,
    DeleteChatProvider,
    UpdateChatThemeProvider,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
