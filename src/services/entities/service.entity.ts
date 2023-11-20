import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from '../../groups/entities/group.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { IsInt, IsPositive, IsString } from 'class-validator';
import { Worker } from 'src/workers/entities/worker.entity';
import { Room } from 'src/rooms/entities/room.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  @IsString()
  name: string;

  @Column({
    type: 'text',
  })
  @IsString()
  description: string;

  @Column({
    type: 'smallint',
    unsigned: true,
  })
  @IsInt()
  @IsPositive()
  minutes_per_session: number;

  @Column({
    type: 'int',
    unsigned: true,
  })
  @IsInt()
  @IsPositive()
  cost_per_session: number;

  @ManyToOne(() => Group, (group) => group.services, { nullable: true })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments: Appointment[];

  @ManyToMany(() => Worker, (worker) => worker.services)
  workers: Worker[];

  @ManyToMany(() => Room, (room) => room.services)
  rooms: Room[];
}
