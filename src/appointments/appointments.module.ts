import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { ServicesModule } from 'src/services/services.module';
import { UsersModule } from 'src/users/users.module';
import { WorkersModule } from 'src/workers/workers.module';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    UsersModule,
    ServicesModule,
    WorkersModule,
    RoomsModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
