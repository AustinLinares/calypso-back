import { Module, forwardRef } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from './entities/worker.entity';
import { ServicesModule } from 'src/services/services.module';
import { RoomsSchedulesModule } from 'src/rooms_schedules/rooms_schedules.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Worker]),
    forwardRef(() => ServicesModule),
    RoomsSchedulesModule,
  ],
  controllers: [WorkersController],
  providers: [WorkersService],
  exports: [WorkersService],
})
export class WorkersModule {}
