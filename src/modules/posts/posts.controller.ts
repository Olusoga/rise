import { Controller, Get, Body, Param, UseGuards, Req, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';


@ApiTags('posts') 
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBearerAuth() 
  @ApiBody({
    description: 'The data needed to create a new post',
    type: CreatePostDto, 
    examples: {
      example1: {
        summary: 'Example post creation',
        value: {
          title: 'My first post',
          content: 'This is the content of my first post!',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Post successfully created.',
    type: Post, 
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token is missing or invalid.',
  })
  @UseGuards(AuthGuard('jwt'))
  create(@Req() req, @Body() createPostDto: CreatePostDto) {
    const user = req.user.id;
    return this.postsService.create(createPostDto, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by its ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the post',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Post found successfully.',
   
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
  })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }
}
