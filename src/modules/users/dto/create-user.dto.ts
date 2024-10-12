import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { User } from '../../../database/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'A valid email address for the user',
  })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
  })
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @ApiProperty({
    example: 'Password@123',
    description:
      'A password that is at least 8 characters long, contains at least one uppercase letter, one digit, and one special character',
  })
  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one digit, and one special character.',
  })
  password: string;
}

export class CreateUserResponseDto extends OmitType(User, ['password', 'createdAt', 'updatedAt'] as any) {
  }
