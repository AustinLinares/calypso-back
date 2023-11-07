import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Worker } from '../../workers/entities/worker.entity';

@Entity('workers_schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: number;

  @Column({
    type: 'datetime',
  })
  start_time: Date;

  @Column({
    type: 'datetime',
  })
  end_time: Date;

  @ManyToOne(() => Worker, (worker) => worker.schedules)
  @JoinColumn({ name: 'worker_id' })
  worker: Worker;
}
