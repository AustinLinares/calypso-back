import { Module, forwardRef } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { ServicesModule } from 'src/services/services.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { RoomsSchedulesModule } from 'src/rooms_schedules/rooms_schedules.module';

@Module({
  imports: [
    ServicesModule,
    RoomsModule,
    RoomsSchedulesModule,
    forwardRef(() => AppointmentsModule),
  ],
  providers: [ReservationService],
  exports: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {}
