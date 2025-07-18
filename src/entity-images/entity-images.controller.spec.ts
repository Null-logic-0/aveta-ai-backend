import { Test, TestingModule } from '@nestjs/testing';
import { EntityImagesController } from './entity-images.controller';

describe('EntityImagesController', () => {
  let controller: EntityImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntityImagesController],
    }).compile();

    controller = module.get<EntityImagesController>(EntityImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
