import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from '../../database/entities/comment.entity';

@ApiTags('comments') 
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':postId/post')
  @ApiOperation({ summary: 'Create a comment on a post' }) 
  @ApiBearerAuth()
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post on which to comment',
    example: '123',
  })
  @ApiBody({
    description: 'The data required to create a comment',
    type: CreateCommentDto, 
    examples: {
      example1: {
        summary: 'Example comment creation',
        value: {
          content: 'This is a comment!',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Comment successfully created.',
    type: Comment, 
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token is missing or invalid.',
  })
  @UseGuards(AuthGuard('jwt')) 
  create(
    @Req() req, 
    @Param('postId') postId: string, 
    @Body() createCommentDto: CreateCommentDto
  ) {
    const user = req.user.id;
    return this.commentsService.create(createCommentDto, postId, user);
  }
}
