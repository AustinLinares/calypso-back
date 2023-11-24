import { Module, forwardRef } from '@nestjs/common';
import { RoomsSchedulesService } from './rooms_schedules.service';
import { RoomsSchedulesController } from './rooms_schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsSchedule } from './entities/rooms_schedule.entity';
import { WorkersModule } from 'src/workers/workers.module';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomsSchedule]),
    RoomsModule,
    forwardRef(() => WorkersModule),
  ],
  controllers: [RoomsSchedulesController],
  providers: [RoomsSchedulesService],
  exports: [RoomsSchedulesService],
})
export class RoomsSchedulesModule {}
