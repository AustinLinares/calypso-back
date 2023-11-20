import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Worker } from '../../workers/entities/worker.entity';
import { IsInt, IsPositive, Validate } from 'class-validator';
import { IsDayOfWeek } from 'src/utils/customValidators/IsDayOfWeek';
import { IsTime } from 'src/utils/customValidators/IsTime';

@Entity('workers_schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'tinyint',
    unsigned: true,
  })
  @IsInt()
  @IsPositive()
  @Validate(IsDayOfWeek, {
    message: 'Invalid day of week',
  })
  day: number;

  @Column({
    type: 'time',
  })
  @Validate(IsTime, {
    message: 'Invalid Time, the correct format is HH:mm:ss',
  })
  start_time: string;

  @Column({
    type: 'time',
  })
  @Validate(IsTime, {
    message: 'Invalid Time, the correct format is HH:mm:ss',
  })
  end_time: string;

  @ManyToOne(() => Worker, (worker) => worker.schedules)
  @JoinColumn({ name: 'worker_id' })
  worker: Worker;
}
