import { IsDate, IsEnum, IsInt, IsPositive, IsString } from 'class-validator';
import { Service } from 'src/services/entities/service.entity';
import { User } from 'src/users/entities/user.entity';
// import { Worker } from 'src/workers/entities/worker.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SessionState } from '../interfaces/SessionState.interface';
import { Room } from 'src/rooms/entities/room.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  @IsDate()
  date: Date;

  @Column({ type: 'time' })
  @IsDate()
  start_time: string;

  @Column({ type: 'time' })
  @IsDate()
  end_time: string;

  @Column({
    type: 'int',
    default: 1,
  })
  @IsInt()
  @IsPositive()
  sessions: number;

  @Column({
    type: 'int',
    unsigned: true,
  })
  @IsInt()
  @IsPositive()
  cost: number;

  @Column({
    type: 'enum',
    enum: SessionState,
    default: SessionState.BOOKED,
  })
  @IsEnum(SessionState, {
    message: `State must be one of: ${Object.values(SessionState)
      .join(', ')
      .toLowerCase()}`,
  })
  state: SessionState;

  @Column({ nullable: true, type: 'text', default: null })
  @IsString()
  comment: string;

  @UpdateDateColumn()
  @IsDate()
  updated_at: Date;

  // @ManyToOne(() => Worker, (worker) => worker.appointments)
  // @JoinColumn({ name: 'worker_id' })
  // worker: Worker;

  @ManyToOne(() => Service, (service) => service.appointments)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Room, (room) => room.appointments)
  @JoinColumn({ name: 'room_id' })
  room: Room;
}
