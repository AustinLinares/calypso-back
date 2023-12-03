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
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { CustomConfigModule } from './custom-config/config.module';
import { TypeOrmConfigService } from './custom-config/type-orm-config/type-orm-config.service';
import { MailerConfigService } from './custom-config/mailer-config/mailer-config.service';
import { JwtConfigService } from './custom-config/jwt-config/jwt-config.service';
import { RoleModule } from './role/role.module';
import { ReservationModule } from './reservation/reservation.module';
import { RoomsSchedulesModule } from './rooms_schedules/rooms_schedules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    MailerModule.forRootAsync({
      useClass: MailerConfigService,
    }),
    UsersModule,
    WorkersModule,
    AppointmentsModule,
    ServicesModule,
    SchedulesModule,
    GroupsModule,
    RoomsModule,
    AuthModule,
    MailModule,
    CustomConfigModule,
    RoleModule,
    ReservationModule,
    RoomsSchedulesModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtConfigService],
})
export class AppModule {}
