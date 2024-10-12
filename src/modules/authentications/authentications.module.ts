import { Module } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { AuthenticationsController } from './authentications.controller';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[ TypeOrmModule.forFeature([User])],
  controllers: [AuthenticationsController],
  providers: [AuthenticationsService, UsersService, LocalStrategy, JwtStrategy,JwtService]
})
export class AuthenticationsModule {}
