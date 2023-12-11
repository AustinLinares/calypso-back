import { Module, forwardRef } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { ServicesModule } from 'src/services/services.module';
import { RoomsSchedulesModule } from 'src/rooms_schedules/rooms_schedules.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    forwardRef(() => ServicesModule),
    forwardRef(() => RoomsSchedulesModule),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
