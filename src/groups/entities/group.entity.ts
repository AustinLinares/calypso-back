import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from '../../services/entities/service.entity';
import { IsString } from 'class-validator';

@Entity('services_groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  @IsString()
  name: string;

  @OneToMany(() => Service, (service) => service.group)
  services: Service[];
}
