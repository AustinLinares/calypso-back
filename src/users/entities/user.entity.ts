import { IsEmail, IsMobilePhone, IsString, Length } from 'class-validator';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Length(0, 20)
  name: string;

  @Column({
    unique: true,
  })
  @IsString()
  @IsMobilePhone('es-CL')
  phone: string;

  @Column({
    unique: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];
}
