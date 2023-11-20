import { IsString } from 'class-validator';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Service } from 'src/services/entities/service.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  @IsString()
  name: string;

  @OneToMany(() => Appointment, (appointment) => appointment.room)
  appointments: Appointment[];

  @ManyToMany(() => Service, (service) => service.rooms)
  @JoinTable({
    name: 'rooms_services',
  })
  services: Service[];

  // @OneToMany(() => RoomsSchedule, (schedule) => schedule.room)
  // schedules: RoomsSchedule[];
}
