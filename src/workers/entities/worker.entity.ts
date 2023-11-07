import { Appointment } from 'src/appointments/entities/appointment.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { Service } from 'src/services/entities/service.entity';

@Entity('workers')
export class Worker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  is_active: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
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

  @ManyToMany(() => Service)
  @JoinTable({
    name: 'workers_services',
  })
  services: Service[];
}
