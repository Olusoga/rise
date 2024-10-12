import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../../database/entities/comment.entity';
import { Post } from '../../database/entities/post.entity';
import { User } from '../../database/entities/user.entity';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';

@Module({
  imports : [TypeOrmModule.forFeature([Comment, Post, User])],
  controllers: [CommentsController],
  providers: [CommentsService, UsersService,PostsService],
})
export class CommentsModule {}
