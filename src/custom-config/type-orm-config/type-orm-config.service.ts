import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get('DB_HOST') || 'localhost',
      port: parseInt(this.configService.get('DB_PORT')) || 3306,
      username: this.configService.get('DB_USERNAME') || 'root',
      password: this.configService.get('DB_PASSWORD') || '',
      database: this.configService.get('DB_NAME') || 'calypso_db',
      autoLoadEntities: true,
      synchronize: this.configService.get('DEVELOPMENT') === 'true',
      logging: true,
    };
  }
}
