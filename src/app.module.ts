import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WorkersModule } from './workers/workers.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ServicesModule } from './services/services.module';
import { SchedulesModule } from './schedules/schedules.module';
import { GroupsModule } from './groups/groups.module';
import { RoomsModule } from './rooms/rooms.module';
// import { RoomsSchedulesModule } from './rooms_schedules/rooms_schedules.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'calypso_db',
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      synchronize: true,
      timezone: '-03:00',
    }),
    UsersModule,
    WorkersModule,
    AppointmentsModule,
    ServicesModule,
    SchedulesModule,
    GroupsModule,
    RoomsModule,
    // RoomsSchedulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
