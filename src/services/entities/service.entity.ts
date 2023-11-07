import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from '../../groups/entities/group.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { IsInt, IsPositive, IsString } from 'class-validator';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  name: string;

  @Column({
    type: 'text',
  })
  @IsString()
  description: string;

  @Column()
  @IsInt()
  @IsPositive()
  minutes_per_session: number;

  @Column()
  @IsInt()
  @IsPositive()
  cost_per_session: number;

  @ManyToOne(() => Group, (group) => group.services)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments: Appointment[];
}
