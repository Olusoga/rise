import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class  CreateAuthenticationDto{

@IsString({ message: 'Name must be a string.' })
@IsNotEmpty({ message: 'Name is required.' })
name: string;
  
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one digit' })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, { message: 'Password must contain at least one special character' })
  password: string;
}
