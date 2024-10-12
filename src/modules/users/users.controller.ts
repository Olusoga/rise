import { Controller, Get  } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@ApiTags('users') 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('top-users-with-latest-comment')
  @ApiOperation({
    summary: 'Get top users with the latest comments',
    description: 'Retrieve the top 3 users with the most posts and their most recent comments.',
  })
  @ApiResponse({
    status: 200,
    description: 'Top users retrieved successfully.',
    content: {
      'application/json': {
        example: [
          {
            userId: 1,
            name: 'John Doe',
            title: 'Post title',
            content: 'Latest comment content',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No users found or no posts/comments available.',
  })
  async getTopUsersWithLatestComment() {
    return await this.usersService.getTopUsersWithLatestComment();
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all users',
    description: 'Fetch all registered users from the database.',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully.',
    type: [UserDto],
    content: {
      'application/json': {
        example: [
          {
            userId: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
          {
            userId: 2,
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No users found.',
  })
  findAll() {
    return this.usersService.findAll();
  }
}