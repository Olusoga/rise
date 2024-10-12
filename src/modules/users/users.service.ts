import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from '../../shared/utils/hashdehash';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private  userRepository: Repository<User>){}
  async create(createUserDto: CreateUserDto):Promise<CreateUserResponseDto> {
    try{
      const existingUser = await this.findUserByEmail( createUserDto.email );
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const userData = {
      email: createUserDto.email,
      name: createUserDto.name,
      password: hash(createUserDto.password)
    };
    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);

    // Map saved user to the CreateUserResponseDto (excluding password)
    const response: CreateUserResponseDto = {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      createdAt: savedUser.createdAt,
    };

    return response;
  

    }catch(error){
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error
    }
  }

  async getTopUsersWithLatestComment(): Promise<any[]> {
    const query = `
  -- Find the top 3 users who have posted the most.
  -- We count the number of posts each user has and sort by that count in descending order.
  WITH TopUsers AS (
    SELECT 
      u.id AS userId, 
      u.name, 
      COUNT(p.id) AS postCount
    FROM 
      "user" u
    LEFT JOIN 
      post p ON u.id = p."userId"
    GROUP BY 
      u.id
    ORDER BY 
      postCount DESC
    LIMIT 3
  ),

  -- Find the latest comment for each post.
  -- Rank comments for each post based on when they were created (newest first).
  LatestComments AS (
    SELECT 
      c."postId",
      c.content,
      c."createdAt",
      ROW_NUMBER() OVER (PARTITION BY c."postId" ORDER BY c."createdAt" DESC) AS rank
    FROM 
      comment c
  )

  -- Combine everything:
  -- For each top user, pull their posts, and if there's a comment, we include the latest one.
  SELECT 
    tu.userId,
    tu.name,
    p.title,
    lc.content AS latestComment
  FROM 
    TopUsers tu
  LEFT JOIN 
    post p ON tu.userId = p."userId"
  LEFT JOIN 
    LatestComments lc ON p.id = lc."postId" AND lc.rank = 1
  ORDER BY 
    tu.postCount DESC;
`;
    return await this.userRepository.query(query);
  }
  async findAll() {
    return this.userRepository.find({
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
    });
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: {email:email},
    });
  }

 findUserById(id:number) {
  return this.userRepository.findOne({
    where: {id:id}
  })
 }
}
