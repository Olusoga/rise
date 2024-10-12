import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationsService } from '../authentications.service';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthenticationsService,
  ) {
    super();
  }

  async validate(email: string, password: string) {
    
    try {
      const user = await this.authService.validateUser(email, password)
      return user
  
    } catch (error) {
      throw error.message
    }
}
}