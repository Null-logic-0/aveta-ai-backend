import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dtos/create-chat.dto';
import { UpdateChatThemeDto } from './dtos/update-chat-theme.dto';
import { ActiveUserData } from '../auth/interface/active-user.interface';
import { Role } from '../auth/enums/role.enum';
import { UserPlan } from '../subscription/enums/userPlan.enum';
import { Chat } from './chat.entity';

describe('ChatController', () => {
  let controller: ChatController;
  let chatService: jest.Mocked<ChatService>;

  const mockChatService = {
    getAll: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [{ provide: ChatService, useValue: mockChatService }],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    chatService = module.get(ChatService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser: ActiveUserData = {
    sub: 1,
    email: 'user@example.com',
    role: Role.User,
    userPlan: UserPlan.Free,
    tokenVersion: 1,
  };

  describe('getAllChat', () => {
    it('should call chatService.getAll with userId and return chats', async () => {
      const result: Chat[] = [
        {
          id: 1,
          messages: [],
          character: { id: 1, name: 'Test Character', greeting: 'Hi!' } as any,
          user: { id: 1 } as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Chat,
        {
          id: 2,
          messages: [],
          character: {
            id: 2,
            name: 'Another Character',
            greeting: 'Hello!',
          } as any,
          user: { id: 1 } as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Chat,
      ];

      chatService.getAll.mockResolvedValue(result);

      const response = await controller.getAllChat(mockUser);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(chatService.getAll).toHaveBeenCalledWith(mockUser.sub);
      expect(response).toEqual(result);
    });
  });

  describe('getChat', () => {
    it('should call chatService.getOne with chatId and return chat', async () => {
      const chatId = 5;
      const result = {
        greeting: 'Hello!',
        chat: {
          id: chatId,
          theme: 'dark',
          messages: [],
          character: {
            id: 1,
            name: 'Test Character',
            greeting: 'Hello!',
          } as any,
          user: { id: 1 } as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      chatService.getOne.mockResolvedValue(result);

      const response = await controller.getChat(chatId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(chatService.getOne).toHaveBeenCalledWith(chatId);
      expect(response).toEqual(result);
    });
  });

  describe('createChat', () => {
    it('should call chatService.create with characterId, userId, dto and return result', async () => {
      const characterId = 3;
      const dto: CreateChatDto = { theme: 'dark.png' };
      const result = {
        greeting: 'Hello!',
        chat: {
          id: 1,
          theme: 'dark.png',
          messages: [],
          character: {
            id: 1,
            name: 'Test Character',
            greeting: 'Hello!',
          } as any,
          user: { id: 1 } as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      chatService.create.mockResolvedValue(result);

      const response = await controller.createChat(characterId, mockUser, dto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(chatService.create).toHaveBeenCalledWith(
        characterId,
        mockUser.sub,
        dto,
      );
      expect(response).toEqual(result);
    });
  });

  describe('UpdateChatTheme', () => {
    it('should call chatService.update with chatId, userId, dto and return result', async () => {
      const chatId = 4;
      const dto: UpdateChatThemeDto = { theme: 'dark' };
      const chat = {
        id: chatId,
        theme: 'dark',
        messages: [],
        character: { id: 1, name: 'Test Character', greeting: 'Hello!' } as any,
        user: { id: 1 } as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = {
        updated: true,
        message: 'Chat theme updated successfully',
        chat,
      };

      chatService.update.mockResolvedValue(result);

      const response = await controller.UpdateChatTheme(chatId, mockUser, dto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(chatService.update).toHaveBeenCalledWith(
        chatId,
        mockUser.sub,
        dto,
      );
      expect(response).toEqual(result);
    });
  });

  describe('deleteChat', () => {
    it('should call chatService.delete with userId and chatId and return result', async () => {
      const chatId = 7;
      const result = {
        deleted: true,
        message: 'Chat deleted successfully',
      };
      chatService.delete.mockResolvedValue(result);

      const response = await controller.deleteChat(chatId, mockUser);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(chatService.delete).toHaveBeenCalledWith(mockUser.sub, chatId);
      expect(response).toEqual(result);
    });
  });
});
