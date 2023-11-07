import { Service } from 'src/services/entities/service.entity';
import { User } from 'src/users/entities/user.entity';
import { Worker } from 'src/workers/entities/worker.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  start_time: Date;

  @Column({ type: 'datetime' })
  end_time: Date;

  @Column()
  sessions: number;

  @Column()
  cost: number;

  @Column({
    default: 'pending',
  })
  state: string;

  @Column({ nullable: true, type: 'text' })
  comment: string;

  @ManyToOne(() => Worker, (worker) => worker.appointments)
  @JoinColumn({ name: 'worker_id' })
  worker: Worker;

  @ManyToOne(() => Service, (service) => service.appointments)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
