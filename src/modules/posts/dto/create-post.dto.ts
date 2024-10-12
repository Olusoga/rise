import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'How to Use NestJS with Swagger',
    description: 'The title of the post, which should be at least 3 characters long',
  })
  @IsNotEmpty({ message: 'Title is required.' })
  @IsString({ message: 'Title must be a string.' })
  @MinLength(3, { message: 'Title must be at least 3 characters long.' })
  title: string;

  @ApiProperty({
    example: 'This is a comprehensive guide on how to integrate NestJS with Swagger...',
    description: 'The content of the post, which should be at least 10 characters long',
  })
  @IsNotEmpty({ message: 'Content is required.' })
  @IsString({ message: 'Content must be a string.' })
  @MinLength(10, { message: 'Content must be at least 10 characters long.' })
  content: string;
}

