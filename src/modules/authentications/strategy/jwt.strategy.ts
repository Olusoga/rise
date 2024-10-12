import * as dotenv from 'dotenv';
dotenv.config();

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(public configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_KEY'),
    });
  }

  async validate(payload: any) {
    try {

      // Extract userId and email from payload
      const userId = payload.id;
      const email = payload.email;
  

      return { userId, email};
    } catch (error) {
      throw new Error(`Error validating JWT payload: ${error.message}`);
    }
  }
}
