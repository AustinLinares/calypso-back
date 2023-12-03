import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { Service } from 'src/services/entities/service.entity';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsString,
  Length,
} from 'class-validator';
import { RoomsSchedule } from 'src/rooms_schedules/entities/rooms_schedule.entity';
import { Role } from 'src/role/enums/role.enum';

@Entity('workers')
export class Worker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Length(3, 20)
  first_name: string;

  @Column()
  @IsString()
  @Length(3, 20)
  last_name: string;

  @Column()
  @IsString()
  @IsMobilePhone('es-CL')
  phone: string;

  @Column()
  @IsString()
  @IsEmail()
  email: string;

  @Column({
    default: true,
  })
  @IsBoolean()
  is_available: boolean;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn({
    nullable: true,
    default: null,
  })
  @IsDate()
  deleted_at: Date;

  @Column()
  speciality: string;

  @Column({ type: 'text', nullable: true })
  presentation: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.WORKER,
  })
  @IsEnum(Role, {
    message: `Role must be one of: ${Object.values(Role)
      .join(', ')
      .toLowerCase()}`,
  })
  role: Role;

  @Column({
    select: false,
  })
  @IsString()
  hash_password: string;

  @Column({
    nullable: true,
    select: false,
  })
  @IsString()
  reset_token: string;

  @OneToMany(() => Schedule, (schedule) => schedule.worker)
  schedules: Schedule[];

  // @OneToMany(() => Appointment, (appointment) => appointment.worker)
  // appointments: Appointment[];

  @ManyToMany(() => Service, (service) => service.workers)
  @JoinTable({
    name: 'workers_services',
  })
  services: Service[];

  @ManyToMany(() => RoomsSchedule, (roomSchedule) => roomSchedule.workers, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'workers_room_schedule',
  })
  room_schedules: RoomsSchedule[];
}
