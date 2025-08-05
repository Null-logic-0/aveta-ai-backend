/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { BlogsService } from './blogs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Blog } from './blogs.entity';
import { Repository } from 'typeorm';
import { CreateBlogProvider } from './providers/create-blog.provider';
import { UpdateBlogProvider } from './providers/update-blog.provider';
import { DeleteBlogProvider } from './providers/delete-blog.provider';
import { PaginationProvider } from '../common/pagination/providers/pagination.provider';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BlogsService', () => {
  let service: BlogsService;
  let blogRepository: jest.Mocked<Repository<Blog>>;
  let createBlogProvider: jest.Mocked<CreateBlogProvider>;
  let updateBlogProvider: jest.Mocked<UpdateBlogProvider>;
  let deleteBlogProvider: jest.Mocked<DeleteBlogProvider>;
  let paginationProvider: jest.Mocked<PaginationProvider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogsService,
        {
          provide: getRepositoryToken(Blog),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue({
              orderBy: jest.fn().mockReturnThis(),
            }),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: CreateBlogProvider,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: UpdateBlogProvider,
          useValue: {
            update: jest.fn(),
          },
        },
        {
          provide: DeleteBlogProvider,
          useValue: {
            delete: jest.fn(),
          },
        },
        {
          provide: PaginationProvider,
          useValue: {
            paginateQuery: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BlogsService>(BlogsService);
    blogRepository = module.get(getRepositoryToken(Blog));
    createBlogProvider = module.get(CreateBlogProvider);
    updateBlogProvider = module.get(UpdateBlogProvider);
    deleteBlogProvider = module.get(DeleteBlogProvider);
    paginationProvider = module.get(PaginationProvider);
  });

  describe('createBlog', () => {
    it('should call createBlogProvider.create and return result', async () => {
      const dto = { title: 'Test' } as any;
      const file = {} as Express.Multer.File;
      const userId = 1;
      const mockResult = { id: 1, title: 'Test' };
      createBlogProvider.create.mockResolvedValue(mockResult as Blog);

      const result = await service.createBlog(userId, dto, file);

      expect(createBlogProvider.create).toHaveBeenCalledWith(userId, dto, file);
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateBlog', () => {
    it('should call updateBlogProvider.update and return result', async () => {
      const blogId = 1;
      const userId = 1;
      const dto = { title: 'Updated Title' } as any;
      const file = {} as Express.Multer.File;
      const mockResult = { id: 1, title: 'Updated Title' };
      updateBlogProvider.update.mockResolvedValue(mockResult as Blog);

      const result = await service.updateBlog(blogId, userId, dto, file);

      expect(updateBlogProvider.update).toHaveBeenCalledWith(
        blogId,
        userId,
        dto,
        file,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getAllBlogs', () => {
    it('should paginate blogs', async () => {
      const mockPaginated = {
        data: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1,
        },
        links: {
          first: '/?page=1',
          previous: '',
          current: '/?page=1',
          next: '',
          last: '/?page=1',
        },
      };

      paginationProvider.paginateQuery.mockResolvedValue(mockPaginated);

      const result = await service.getAllBlogs({ limit: 10, page: 1 });

      expect(paginationProvider.paginateQuery).toHaveBeenCalled();
      expect(result).toEqual(mockPaginated);
    });

    it('should throw BadRequestException on error', async () => {
      blogRepository.createQueryBuilder = jest.fn(() => {
        throw new Error('DB error');
      });

      await expect(service.getAllBlogs()).rejects.toThrow(BadRequestException);
    });
  });

  describe('getSingleBlog', () => {
    it('should return blog if found', async () => {
      const blog = { id: 1, title: 'Test' } as Blog;
      blogRepository.findOneBy.mockResolvedValue(blog);

      const result = await service.getSingleBlog(1);

      expect(blogRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(blog);
    });

    it('should throw NotFoundException if not found', async () => {
      blogRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getSingleBlog(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on other errors', async () => {
      blogRepository.findOneBy.mockRejectedValue(new Error('Some error'));

      await expect(service.getSingleBlog(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removeBlog', () => {
    it('should call deleteBlogProvider.delete and return result', async () => {
      const result = { deleted: true, message: 'Blog deleted successfully' };
      deleteBlogProvider.delete.mockResolvedValue(result);

      const response = await service.removeBlog(1, 2);

      expect(deleteBlogProvider.delete).toHaveBeenCalledWith(1, 2);
      expect(response).toEqual(result);
    });
  });
});
