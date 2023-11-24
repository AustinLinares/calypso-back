import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './type-orm-config/type-orm-config.service';
import { MailerConfigService } from './mailer-config/mailer-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [TypeOrmConfigService, MailerConfigService],
  exports: [TypeOrmConfigService, MailerConfigService],
})
export class CustomConfigModule {}
