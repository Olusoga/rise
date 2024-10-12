import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthenticationDto {
  @ApiProperty({
    description: 'User email address used as the username.',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsNotEmpty({ message: 'Username (email) is required.' })
  username: string;

  @ApiProperty({
    description: 'User password.',
    example: 'Password@123',
  })
  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}
