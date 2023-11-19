import { Appointment } from 'src/appointments/entities/appointment.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { Service } from 'src/services/entities/service.entity';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsMobilePhone,
  IsString,
} from 'class-validator';

@Entity('workers')
export class Worker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @IsString()
  @IsMobilePhone('es-CL')
  phone: string;

  @Column()
  @IsString()
  @IsEmail()
  email: string;

  @Column({
    default: true,
  })
  @IsBoolean()
  is_available: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @IsDate()
  created_at: Date;

  @DeleteDateColumn({
    nullable: true,
    default: null,
  })
  @IsDate()
  deleted_at: Date;

  @Column()
  speciality: string;

  @Column({ type: 'text', nullable: true })
  presentation: string;

  @Column()
  position: string;

  @OneToMany(() => Schedule, (schedule) => schedule.worker)
  schedules: Schedule[];

  @OneToMany(() => Appointment, (appointment) => appointment.worker)
  appointments: Appointment[];

  @ManyToMany(() => Service, (service) => service.workers, {
    cascade: true,
  })
  @JoinTable({
    name: 'workers_services',
  })
  services: Service[];
}
