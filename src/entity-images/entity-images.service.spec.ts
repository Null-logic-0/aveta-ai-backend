import { Test, TestingModule } from '@nestjs/testing';
import { EntityImagesService } from './entity-images.service';

describe('EntityImagesService', () => {
  let service: EntityImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityImagesService],
    }).compile();

    service = module.get<EntityImagesService>(EntityImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
