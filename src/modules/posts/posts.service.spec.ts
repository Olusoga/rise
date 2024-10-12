import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../../database/entities/post.entity';
import { NotFoundError } from 'rxjs';
import { CreatePostDto } from './dto/create-post.dto';
import { mockPost, mockUser } from '../../shared/mock-data/mock-entity';

describe('PostsService', () => {
  let postsService: PostsService;
  let usersService: UsersService;
  let postRepository: Repository<Post>;

  
  const mockCreatePostDto: CreatePostDto = {
    title: 'Test Post',
    content: 'This is a test post',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should successfully create a post when the user exists ', async () => {
      // Mock the user service to return a user
      jest.spyOn(usersService, 'findUserById').mockResolvedValue(mockUser);

      // Mock the repository methods
      jest.spyOn(postRepository, 'create').mockReturnValue(mockPost);
      jest.spyOn(postRepository, 'save').mockResolvedValue(mockPost);

      // Call the service method
      const result = await postsService.create(mockCreatePostDto, mockUser.id);

      // Assert the result
      expect(result).toEqual({
        id: 1,
        title: 'Test Post',
        content: 'This is a test post',
        createdAt: mockPost.createdAt,
        updatedAt: mockPost.updatedAt,
        user: mockUser, // Ensuring user details are there
      });

      expect(usersService.findUserById).toHaveBeenCalledWith(mockUser.id);
      expect(postRepository.create).toHaveBeenCalledWith({
        ...mockCreatePostDto,
        user: { id: mockUser.id, name: mockUser.name, email: mockUser.email },
      });
      expect(postRepository.save).toHaveBeenCalledWith(mockPost);
    });

    it('should throw a NotFoundError if the user is not found ', async () => {
      // Mock the user service to return null (user not found)
      jest.spyOn(usersService, 'findUserById').mockResolvedValue(null);

      try {
        // Attempt to create the post, expecting it to throw
        await postsService.create(mockCreatePostDto, 99); // Non-existent user ID
      } catch (error) {
        // Assert the error
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.message).toBe('user not found');
      }

      expect(usersService.findUserById).toHaveBeenCalledWith(99);
      expect(postRepository.create).not.toHaveBeenCalled();
      expect(postRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a post when found', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost);

      const result = await postsService.findOne(1);

      expect(result).toEqual(mockPost);
      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if the post is not found', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

      const result = await postsService.findOne(99);

      expect(result).toBeNull();
      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { id: 99 },
      });
    });
  });
});
