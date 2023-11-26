import { AuthModule } from './../auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from './entities/worker.entity';
import { ServicesModule } from 'src/services/services.module';
import { RoomsSchedulesModule } from 'src/rooms_schedules/rooms_schedules.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Worker]),
    forwardRef(() => ServicesModule),
    RoomsSchedulesModule,
    forwardRef(() => AuthModule),
    MailModule,
  ],
  controllers: [WorkersController],
  providers: [WorkersService],
  exports: [WorkersService],
})
export class WorkersModule {}
