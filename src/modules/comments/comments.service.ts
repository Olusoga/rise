import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { Comment } from '../../database/entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor( @InjectRepository(Comment) private commentRepository:Repository<Comment>,
private readonly userService: UsersService,
private readonly postService:PostsService
){}

  async create(createCommentDto: CreateCommentDto, postId: any, userId:any) {
    try{
      const user = await this.userService.findUserById(userId)
      if(!user) {
        throw new NotFoundError('user not found')
      }
      const post = await this.postService.findOne(postId)
      if(!post) {
        throw new NotFoundError('post not found')
      }

      const comment = this.commentRepository.create({
        ...createCommentDto,
        user: { id: user.id },
        post
      })
      const savedComment = await this.commentRepository.save(comment);

      const { userId: _, ...postWithoutUserId } = savedComment 
      return postWithoutUserId;
    }catch(error){
      if (error instanceof NotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error

    }
  }
}
