import { Controller, Get, Request, Res, Post, Body, UseGuards } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginAuthenticationDto } from './dto/login-authentication.dto';

@ApiTags('authentications')
@Controller('authentications')
export class AuthenticationsController {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user for authentication' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request, validation errors.' })
  create(@Body() createAuthenticationDto: CreateAuthenticationDto) {
    return this.userService.create(createAuthenticationDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'User login and get a JWT token' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully and token is generated.',
    schema: {
      example: {
        id: '123456789',
        name: 'John Doe',
        email: 'john.doe@example.com',
        token: 'your.jwt.token.here',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid credentials.' })
  async login(
    @Body() loginDto: LoginAuthenticationDto,
    @Request() req,
    @Res({ passthrough: true }) response?: Response,
  ) {
    const payload = {
      name: req.user.name,
      id: req.user.id,
      email: req.user.email,
    };

    return {
      ...payload,
      token: this.jwtService.sign(payload, {
        secret: process.env.JWT_KEY,
      }),
    };
  }
}