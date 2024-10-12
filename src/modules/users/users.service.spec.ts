import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from '../../database/entities/user.entity';


const mockUserRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('UserService', () => {
  let userService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      userRepository.findOne = jest.fn().mockResolvedValue(null); 
      userRepository.create = jest.fn().mockReturnValue(createUserDto);
      userRepository.save = jest.fn().mockResolvedValue({ ...createUserDto, id: 1, createdAt: new Date() });

      const result: CreateUserResponseDto = await userService.create(createUserDto);

      expect(result).toEqual({ id: 1, email: createUserDto.email, name: createUserDto.name, createdAt: expect.any(Date) });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
      expect(userRepository.save).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw a ConflictException if the user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      userRepository.findOne = jest.fn().mockResolvedValue(createUserDto); 

      await expect(userService.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
      expect(userRepository.save).not.toHaveBeenCalled(); 
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: 1, name: 'Test User', email: 'test@example.com', createdAt: new Date() }];
      userRepository.find = jest.fn().mockResolvedValue(users);

      const result = await userService.findAll();

      expect(result).toEqual(users);
      expect(userRepository.find).toHaveBeenCalledWith({ select: ['id', 'name', 'email', 'createdAt', 'updatedAt'] });
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com' };
      userRepository.findOne = jest.fn().mockResolvedValue(user);

      const result = await userService.findUserByEmail(user.email);

      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: user.email } });
    });

    it('should return null if no user found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);

      const result = await userService.findUserByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com' };
      userRepository.findOne = jest.fn().mockResolvedValue(user);

      const result = await userService.findUserById(user.id);

      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
    });

    it('should return null if no user found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);

      const result = await userService.findUserById(999); // Assume this ID doesn't exist

      expect(result).toBeNull();
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });
});
