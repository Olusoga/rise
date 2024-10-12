import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from '../../database/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotFoundError } from 'rxjs';

describe('CommentsService', () => {
  let commentsService: CommentsService;
  let userService: UsersService;
  let postService: PostsService;
  let commentRepository: Repository<Comment>;

  const mockCommentRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUserService = {
    findUserById: jest.fn(),
  };

  const mockPostService = {
    findOne: jest.fn(),
  };

  const mockCreateCommentDto: CreateCommentDto = {
    content: 'This is a test comment',
  };

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'This is a test post',
    comments: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
        { provide: UsersService, useValue: mockUserService },
        { provide: PostsService, useValue: mockPostService },
      ],
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
    userService = module.get<UsersService>(UsersService);
    postService = module.get<PostsService>(PostsService);
    commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a comment when user and post exist (Positive Case)', async () => {
      mockUserService.findUserById.mockResolvedValue(mockUser);
      mockPostService.findOne.mockResolvedValue(mockPost);
      mockCommentRepository.create.mockReturnValue({
        ...mockCreateCommentDto,
        user: { id: mockUser.id },
        post: mockPost,
      });
      mockCommentRepository.save.mockResolvedValue({
        id: 1,
        ...mockCreateCommentDto,
        user: { id: mockUser.id },
        post: mockPost,
      });

      const result = await commentsService.create(mockCreateCommentDto, mockPost.id, mockUser.id);
      expect(result).toEqual({
        id: 1,
        content: 'This is a test comment',
        user: { id: mockUser.id },
        post: mockPost,
      });
      expect(mockUserService.findUserById).toHaveBeenCalledWith(mockUser.id);
      expect(mockPostService.findOne).toHaveBeenCalledWith(mockPost.id);
      expect(mockCommentRepository.create).toHaveBeenCalledWith({
        ...mockCreateCommentDto,
        user: { id: mockUser.id },
        post: mockPost,
      });
      expect(mockCommentRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if user does not exist (Negative Case)', async () => {
    
      mockUserService.findUserById.mockResolvedValue(null);

      await expect(commentsService.create(mockCreateCommentDto, mockPost.id, mockUser.id))
        .rejects
        .toThrow(new NotFoundError('user not found'));
      expect(mockUserService.findUserById).toHaveBeenCalledWith(mockUser.id);
      expect(mockPostService.findOne).not.toHaveBeenCalled();
      expect(mockCommentRepository.create).not.toHaveBeenCalled();
      expect(mockCommentRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError if post does not exist (Negative Case)', async () => {
      mockUserService.findUserById.mockResolvedValue(mockUser);
      mockPostService.findOne.mockResolvedValue(null);
      await expect(commentsService.create(mockCreateCommentDto, mockPost.id, mockUser.id))
        .rejects
        .toThrow(new NotFoundError('post not found'));
      expect(mockUserService.findUserById).toHaveBeenCalledWith(mockUser.id);
      expect(mockPostService.findOne).toHaveBeenCalledWith(mockPost.id);
      expect(mockCommentRepository.create).not.toHaveBeenCalled();
      expect(mockCommentRepository.save).not.toHaveBeenCalled();
    });
  });
});
