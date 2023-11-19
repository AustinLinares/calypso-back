import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Worker } from '../../workers/entities/worker.entity';
import { IsNumber, IsString, Length, Validate } from 'class-validator';
import { IsDayOfWeek } from 'src/utils/customValidators/IsDayOfWeek';
import { IsTime } from 'src/utils/customValidators/IsTime';

@Entity('workers_schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumber()
  @Validate(IsDayOfWeek, {
    message: 'Invalid day of week',
  })
  day: number;

  @Column({
    length: 5,
  })
  @IsString()
  @Length(5)
  @Validate(IsTime, {
    message: 'Invalid Time',
  })
  start_time: string;

  @Column({
    length: 5,
  })
  @IsString()
  @Length(5)
  @Validate(IsTime, {
    message: 'Invalid Time',
  })
  end_time: string;

  @ManyToOne(() => Worker, (worker) => worker.schedules)
  @JoinColumn({ name: 'worker_id' })
  worker: Worker;
}
