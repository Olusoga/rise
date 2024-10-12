import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
        Logger.log('Database connection established', 'DatabaseService');
      } else {
        Logger.log('Database connection is already initialized', 'DatabaseService');
      }
    } catch (error) {
      Logger.error('Failed to connect to the database', error.message, 'DatabaseService');
    }
  }
}
