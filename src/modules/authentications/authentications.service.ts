import {  HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { hash, verify } from '../../shared/utils/hashdehash';


@Injectable()
export class AuthenticationsService {
  constructor(private readonly userService: UsersService){}
 

  async validateUser(email: string, password:string) {
     

   const user = await this.userService.findUserByEmail(email)

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid username',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordMatch =  verify(password,  user.password);
    if (!passwordMatch) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid password',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

}
