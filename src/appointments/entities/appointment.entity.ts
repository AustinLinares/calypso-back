import { IsDate, IsEnum, IsInt, IsPositive, IsString } from 'class-validator';
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
import { SessionState } from '../interfaces/SessionState';
import { Room } from 'src/rooms/entities/room.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  @IsDate()
  start_time: Date;

  @Column({ type: 'datetime' })
  @IsDate()
  end_time: Date;

  @Column()
  @IsInt()
  @IsPositive()
  sessions: number;

  @Column()
  @IsInt()
  @IsPositive()
  cost: number;

  @Column({ default: SessionState.Pending })
  @IsEnum(SessionState, {
    message: 'State must be one of: pending, booked, completed, canceled',
  })
  state: SessionState;

  @Column({ nullable: true, type: 'text' })
  @IsString()
  comment: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @IsDate()
  updated_at: Date;

  @ManyToOne(() => Worker, (worker) => worker.appointments)
  @JoinColumn({ name: 'worker_id' })
  worker: Worker;

  @ManyToOne(() => Service, (service) => service.appointments)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Room, (room) => room.appointments)
  room: Room;
}
