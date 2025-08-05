import { Test, TestingModule } from '@nestjs/testing';
import { EntityImagesService } from './entity-images.service';
import { EntityImage } from './entity-image.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateEntityImageProvider } from './providers/create-entity-image.provider';
import { DeleteEntityImageProvider } from './providers/delete-entity-image.provider';
import { PaginationProvider } from '../common/pagination/providers/pagination.provider';
import { Repository } from 'typeorm';
import { EntityImageType } from './enums/entity-images.enum';

describe('EntityImagesService', () => {
  let service: EntityImagesService;
  let repo: Repository<EntityImage>;

  const mockEntityImageRepository = {
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    })),
  };

  const mockCreateEntityImageProvider = {
    create: jest.fn(),
  };

  const mockDeleteEntityImageProvider = {
    delete: jest.fn(),
  };

  const mockPaginationProvider = {
    paginateQuery: jest.fn().mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntityImagesService,
        {
          provide: getRepositoryToken(EntityImage),
          useValue: mockEntityImageRepository,
        },
        {
          provide: CreateEntityImageProvider,
          useValue: mockCreateEntityImageProvider,
        },
        {
          provide: DeleteEntityImageProvider,
          useValue: mockDeleteEntityImageProvider,
        },
        { provide: PaginationProvider, useValue: mockPaginationProvider },
      ],
    }).compile();

    service = module.get<EntityImagesService>(EntityImagesService);
    repo = module.get<Repository<EntityImage>>(getRepositoryToken(EntityImage));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call createEntityImageProvider.create', async () => {
      const mockFile = {} as Express.Multer.File;
      const mockDto = { type: EntityImageType.AVATAR, entityId: 1 };
      const mockResult = { id: 1 };

      mockCreateEntityImageProvider.create.mockResolvedValue(mockResult);

      const result = await service.create(1, mockDto, mockFile);
      expect(result).toEqual(mockResult);
      expect(mockCreateEntityImageProvider.create).toHaveBeenCalledWith(
        1,
        mockDto,
        mockFile,
      );
    });
  });

  describe('getAll', () => {
    it('should return paginated entity images', async () => {
      const result = await service.getAll(EntityImageType.AVATAR, {
        page: 1,
        limit: 10,
      });
      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });
      expect(mockPaginationProvider.paginateQuery).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should call deleteEntityImageProvider.delete', async () => {
      const mockResult = { success: true };
      mockDeleteEntityImageProvider.delete.mockResolvedValue(mockResult);

      const result = await service.delete(1, 1);
      expect(result).toEqual(mockResult);
      expect(mockDeleteEntityImageProvider.delete).toHaveBeenCalledWith(1, 1);
    });
  });
});
