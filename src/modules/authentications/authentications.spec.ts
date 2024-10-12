import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationsService } from './authentications.service';
import { UsersService } from '../users/users.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { hash, verify } from '../../shared/utils/hashdehash';

describe('AuthenticationsService', () => {
  let authService: AuthenticationsService;
  let userService: UsersService;

  const mockUserService = {
    findUserByEmail: jest.fn(),
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: hash('password123'), 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationsService,
        { provide: UsersService, useValue: mockUserService },
      ],
    }).compile();

    authService = module.get<AuthenticationsService>(AuthenticationsService);
    userService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return the user when email and password are valid (Positive Case)', async () => {
      mockUserService.findUserByEmail.mockResolvedValue(mockUser);

      const result = await authService.validateUser(mockUser.email, 'password123');

      expect(result).toEqual(mockUser);
      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith(mockUser.email);
    });

    it('should throw HttpException for invalid email (Negative Case)', async () => {
      mockUserService.findUserByEmail.mockResolvedValue(null);

      await expect(authService.validateUser('invalid@example.com', 'password123'))
        .rejects
        .toThrow(new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Invalid username' },
          HttpStatus.BAD_REQUEST,
        ));
      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith('invalid@example.com');
    });

    it('should throw HttpException for invalid password (Negative Case)', async () => {
      mockUserService.findUserByEmail.mockResolvedValue(mockUser);

      await expect(authService.validateUser(mockUser.email, 'wrongpassword'))
        .rejects
        .toThrow(new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Invalid password' },
          HttpStatus.BAD_REQUEST,
        ));
      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith(mockUser.email);
    });
  });
});
