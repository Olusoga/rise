import { Controller, Get,Request,Res, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('authentications')
export class AuthenticationsController {
  constructor(private readonly authenticationsService: AuthenticationsService,
    private readonly userService:UsersService,
    private readonly jwtService: JwtService
  ) {}

  @Post()
  create(@Body() createAuthenticationDto: CreateAuthenticationDto) {
    return this.userService.create(createAuthenticationDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response?: Response) { 
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
  }
  };
}
