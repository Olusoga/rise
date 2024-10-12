import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './shared/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceHealthIndicator } from './health-check/maintenance.health';
import { DatabaseService } from './config/db.service';
import { UsersModule } from './modules/users/users.module';
import { AuthenticationsModule } from './modules/authentications/authentications.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
@Module({
  imports: [LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    LoggerModule,
    TerminusModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    UsersModule,
    AuthenticationsModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MaintenanceHealthIndicator ,DatabaseService],
})
export class AppModule {}
