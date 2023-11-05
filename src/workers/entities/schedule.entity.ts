import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Worker } from './worker.entity';

@Entity()
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
  worker: Worker;
}
