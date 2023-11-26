import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST') || 'localhost',
      port: this.configService.get<number>('DB_PORT') || 3306,
      username: this.configService.get<string>('DB_USERNAME') || 'root',
      password: this.configService.get<string>('DB_PASSWORD') || '',
      database: this.configService.get<string>('DB_NAME') || 'calypso_db',
      autoLoadEntities: true,
      synchronize: true,
      timezone: this.configService.get<string>('DB_TIMEZONE') || '-03:00',
    };
  }
}
