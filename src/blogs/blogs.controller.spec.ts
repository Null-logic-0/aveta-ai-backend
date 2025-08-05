/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dtos/create-blog.dto';
import { UpdateBlogDto } from './dtos/update-blog.dto';
import { PaginationQueryDto } from '../common/pagination/dtos/pagination-query.dto';
import { ActiveUserData } from '../auth/interface/active-user.interface';
import { Role } from '../auth/enums/role.enum';
import { UserPlan } from '../subscription/enums/userPlan.enum';

describe('BlogsController', () => {
  let controller: BlogsController;
  let service: BlogsService;

  const mockBlogsService = {
    getAllBlogs: jest.fn(),
    getSingleBlog: jest.fn(),
    createBlog: jest.fn(),
    updateBlog: jest.fn(),
    removeBlog: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogsController],
      providers: [{ provide: BlogsService, useValue: mockBlogsService }],
    }).compile();

    controller = module.get<BlogsController>(BlogsController);
    service = module.get<BlogsService>(BlogsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllBlogs', () => {
    it('should return paginated blogs', async () => {
      const query: PaginationQueryDto = { limit: 10, page: 1 };
      const expected = { data: [], meta: {}, links: {} };
      mockBlogsService.getAllBlogs.mockResolvedValue(expected);

      const result = await controller.getAllBlogs(query);
      expect(service.getAllBlogs).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });
  });

  describe('getSingleBlog', () => {
    it('should return a single blog', async () => {
      const blogId = 1;
      const expected = { id: blogId, title: 'Sample' };
      mockBlogsService.getSingleBlog.mockResolvedValue(expected);

      const result = await controller.getSingleBlog(blogId);
      expect(service.getSingleBlog).toHaveBeenCalledWith(blogId);
      expect(result).toEqual(expected);
    });
  });

  describe('createBlog', () => {
    it('should create and return a blog', async () => {
      const user: ActiveUserData = {
        sub: 1,
        email: 'test@example.com',
        role: Role.Creator,
        userPlan: UserPlan.BASIC,
        tokenVersion: 1,
      };

      const dto: CreateBlogDto = {
        title: 'New Blog',
        excerpt: 'Blog content',
        media: 'aveta-bg.png',
      };

      const file = { filename: 'test.jpg' } as Express.Multer.File;

      const expected = { id: 1, ...dto };

      mockBlogsService.createBlog.mockResolvedValue(expected);

      const result = await controller.createBlog(user, dto, file);

      expect(service.createBlog).toHaveBeenCalledWith(user.sub, dto, file);
      expect(result).toEqual(expected);
    });
  });

  describe('updateBlog', () => {
    it('should update and return a blog', async () => {
      const user: ActiveUserData = {
        sub: 1,
        email: 'test@example.com',
        role: Role.Creator,
        userPlan: UserPlan.BASIC,
        tokenVersion: 1,
      };
      const blogId = 2;
      const dto: UpdateBlogDto = {
        title: 'Updated Blog',
        excerpt: 'Blog content',
        media: 'aveta-bg.png',
      };
      const file = { filename: 'updated.jpg' } as Express.Multer.File;

      const expected = { id: blogId, ...dto };
      mockBlogsService.updateBlog.mockResolvedValue(expected);

      const result = await controller.updateBlog(user, blogId, dto, file);
      expect(service.updateBlog).toHaveBeenCalledWith(
        blogId,
        user.sub,
        dto,
        file,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('deleteBlog', () => {
    it('should delete a blog and return result', async () => {
      const user = { sub: 1 } as ActiveUserData;
      const blogId = 3;
      const expected = { deleted: true, message: 'Deleted successfully' };

      mockBlogsService.removeBlog.mockResolvedValue(expected);

      const result = await controller.deleteBlog(user, blogId);
      expect(service.removeBlog).toHaveBeenCalledWith(user.sub, blogId);
      expect(result).toEqual(expected);
    });
  });
});
