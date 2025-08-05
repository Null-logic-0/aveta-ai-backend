import { Test, TestingModule } from '@nestjs/testing';
import { EntityImagesController } from './entity-images.controller';
import { EntityImagesService } from './entity-images.service';
import { CreateEntityImageDto } from './dtos/create-entity-image.dto';
import { PaginateEntityImageDto } from './dtos/paginate-entity-image.dto';
import { EntityImageType } from './enums/entity-images.enum';
import { ActiveUserData } from '../auth/interface/active-user.interface';
import { Role } from '../auth/enums/role.enum';
import { UserPlan } from '../subscription/enums/userPlan.enum';

const mockEntityImagesService = {
  create: jest.fn(),
  getAll: jest.fn(),
  delete: jest.fn(),
};

describe('EntityImagesController', () => {
  let controller: EntityImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntityImagesController],
      providers: [
        {
          provide: EntityImagesService,
          useValue: mockEntityImagesService,
        },
      ],
    }).compile();

    controller = module.get<EntityImagesController>(EntityImagesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAssets', () => {
    it('should call service.create with correct params', async () => {
      const user: ActiveUserData = {
        sub: 1,
        email: 'test@example.com',
        role: Role.User,
        userPlan: UserPlan.BASIC,
        tokenVersion: 1,
      };
      const dto: CreateEntityImageDto = {
        type: EntityImageType.AVATAR,
        image: 'example.jpg',
      };
      const file = { originalname: 'test.png' } as Express.Multer.File;
      const result = { id: 1, ...dto };

      mockEntityImagesService.create.mockResolvedValue(result);

      const response = await controller.createAssets(user, dto, file);

      expect(mockEntityImagesService.create).toHaveBeenCalledWith(
        user.sub,
        dto,
        file,
      );
      expect(response).toEqual(result);
    });
  });

  describe('getAllImages', () => {
    it('should call service.getAll with type, page and limit', async () => {
      const query: PaginateEntityImageDto = {
        type: EntityImageType.AVATAR,
        page: 1,
        limit: 10,
      };

      const result = { data: [], meta: {} };

      mockEntityImagesService.getAll.mockResolvedValue(result);

      const response = await controller.getAllImages(query);

      expect(mockEntityImagesService.getAll).toHaveBeenCalledWith(query.type, {
        page: query.page,
        limit: query.limit,
      });
      expect(response).toEqual(result);
    });
  });

  describe('deleteImage', () => {
    it('should call service.delete with correct params', async () => {
      const user: ActiveUserData = {
        sub: 1,
        email: 'test@example.com',
        role: Role.User,
        userPlan: UserPlan.BASIC,
        tokenVersion: 1,
      };
      const imageId = 5;
      const result = { success: true };

      mockEntityImagesService.delete.mockResolvedValue(result);

      const response = await controller.deleteImage(user, imageId);

      expect(mockEntityImagesService.delete).toHaveBeenCalledWith(
        user.sub,
        imageId,
      );
      expect(response).toEqual(result);
    });
  });
});
