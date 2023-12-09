import { IsEmail, IsMobilePhone, IsString, Length } from 'class-validator';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Length(3, 50)
  name: string;

  @Column()
  @IsString()
  @IsMobilePhone('es-CL')
  phone: string;

  @Column({
    unique: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  // @Column()
  // @IsString()
  // hash_password: string;

  // @Column({
  //   nullable: true,
  // })
  // @IsString()
  // reset_token: string;

  @Column({
    nullable: true,
    select: false,
  })
  @IsString()
  token: string;

  @OneToMany(() => Appointment, (appointment) => appointment.user, {
    onDelete: 'CASCADE',
  })
  appointments: Appointment[];
}
