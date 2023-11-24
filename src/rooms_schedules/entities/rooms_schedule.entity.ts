import { IsInt, IsPositive, Validate } from 'class-validator';
import { Room } from 'src/rooms/entities/room.entity';
import { IsDayOfWeek } from 'src/utils/customValidators/IsDayOfWeek';
import { IsTime } from 'src/utils/customValidators/IsTime';
import { Worker } from 'src/workers/entities/worker.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rooms_schedules')
export class RoomsSchedule {
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

  @ManyToOne(() => Room, (room) => room.schedules)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToMany(() => Worker, (worker) => worker.room_schedules)
  workers: Worker[];
}
