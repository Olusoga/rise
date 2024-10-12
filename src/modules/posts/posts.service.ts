import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { NotFoundError } from 'rxjs';
import { Post } from '../../database/entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  private readonly userService:UsersService){}
  async create(createPostDto: CreatePostDto, userId: any) {
    try{
      const user = await this.userService.findUserById(userId)
      if(!user) {
        throw new NotFoundError('user not found')
      }
      const post = this.postRepository.create({
        ...createPostDto,
        user: {
          id: user.id, 
          name: user.name, 
          email: user.email,
        }, 
      })
      const savedPost = await this.postRepository.save(post);

    const { userId: _, comments, ...postWithoutUserId } = savedPost;
    return postWithoutUserId;
    }catch(error){
      if (error instanceof NotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error

    }
  }

  
  findOne(id:number) {
    return this.postRepository.findOne({
      where: {id:id}
    })
   }
}
