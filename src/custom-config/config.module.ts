import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './type-orm-config/type-orm-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [TypeOrmConfigService],
  exports: [TypeOrmConfigService],
})
export class CustomConfigModule {}
