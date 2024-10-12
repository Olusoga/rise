import { Controller,Req, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':postId/post')
  @UseGuards(AuthGuard('jwt'))
  create(@Req() req, @Param('postId') postId: string, 
  @Body() createCommentDto: CreateCommentDto) {
    const user = req.user.id
    return this.commentsService.create(createCommentDto, postId , user );
  }
}
