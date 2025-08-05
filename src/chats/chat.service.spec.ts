import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { CreateChatProvider } from './providers/create-chat.provider';
import { DeleteChatProvider } from './providers/delete-chat.provider';
import { UpdateChatThemeProvider } from './providers/update-chat-theme.provider';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateChatThemeDto } from './dtos/update-chat-theme.dto';
import { CreateChatDto } from './dtos/create-chat.dto';

describe('ChatService', () => {
  let service: ChatService;
  let chatRepository: jest.Mocked<Repository<Chat>>;

  const mockCreateChatProvider = {
    create: jest.fn(),
  };

  const mockUpdateChatThemeProvider = {
    update: jest.fn(),
  };

  const mockDeleteChatProvider = {
    delete: jest.fn(),
  };

  // Mock repository with arrow functions to preserve `this`
  const mockChatRepository = {
    findOneBy: jest.fn((...args) => Promise.resolve(null)),
    find: jest.fn((...args) => Promise.resolve([])),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: 'ChatRepository',
          useValue: mockChatRepository,
        },
        {
          provide: CreateChatProvider,
          useValue: mockCreateChatProvider,
        },
        {
          provide: UpdateChatThemeProvider,
          useValue: mockUpdateChatThemeProvider,
        },
        {
          provide: DeleteChatProvider,
          useValue: mockDeleteChatProvider,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);

    // Cast mock repository as jest.Mocked for better typing
    chatRepository = mockChatRepository as unknown as jest.Mocked<
      Repository<Chat>
    >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call createChatProvider.create with correct params', async () => {
      const characterId = 1;
      const userId = 2;
      const createChatDto: CreateChatDto = { theme: 'bg.jpg' };
      const expectedResult = { id: 1, theme: 'bg.jpg' };

      mockCreateChatProvider.create.mockResolvedValue(expectedResult);

      const result = await service.create(characterId, userId, createChatDto);

      expect(mockCreateChatProvider.create).toHaveBeenCalledWith(
        characterId,
        userId,
        createChatDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call updateChatThemeProvider.update with correct params', async () => {
      const chatId = 1;
      const userId = 2;
      const updateChatThemeDto: UpdateChatThemeDto = { theme: 'dark' };
      const expectedResult = { id: chatId, theme: 'dark' };

      mockUpdateChatThemeProvider.update.mockResolvedValue(expectedResult);

      const result = await service.update(chatId, userId, updateChatThemeDto);

      expect(mockUpdateChatThemeProvider.update).toHaveBeenCalledWith(
        chatId,
        userId,
        updateChatThemeDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getOne', () => {
    it('should return chat with greeting if found', async () => {
      const chatId = 1;
      const chat = {
        id: chatId,
        character: { greeting: 'Hello!' },
      } as Chat;

      chatRepository.findOneBy.mockResolvedValue(chat);

      const result = await service.getOne(chatId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(chatRepository.findOneBy).toHaveBeenCalledWith({ id: chatId });
      expect(result).toEqual({
        greeting: 'Hello!',
        chat,
      });
    });

    it('should throw NotFoundException if chat not found', async () => {
      chatRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on other errors', async () => {
      chatRepository.findOneBy.mockRejectedValue(new Error('DB error'));

      await expect(service.getOne(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAll', () => {
    it('should return array of chats', async () => {
      const userId = 1;
      const chats = [
        { id: 1, user: { id: userId }, character: { greeting: 'Hi' } },
      ] as Chat[];

      chatRepository.find.mockResolvedValue(chats);

      const result = await service.getAll(userId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(chatRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['character'],
        order: { updatedAt: 'DESC' },
      });
      expect(result).toEqual(chats);
    });

    it('should throw BadRequestException on error', async () => {
      chatRepository.find.mockRejectedValue(new Error('DB error'));

      await expect(service.getAll(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should call deleteChatProvider.delete with correct params', async () => {
      const userId = 1;
      const chatId = 2;
      const expectedResult = { success: true };

      mockDeleteChatProvider.delete.mockResolvedValue(expectedResult);

      const result = await service.delete(userId, chatId);

      expect(mockDeleteChatProvider.delete).toHaveBeenCalledWith(
        userId,
        chatId,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
