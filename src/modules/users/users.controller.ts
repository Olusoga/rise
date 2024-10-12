import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('top-users-with-latest-comment')
  async getTopUsersWithLatestComment() {
    return await this.usersService.getTopUsersWithLatestComment();
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

 
}
