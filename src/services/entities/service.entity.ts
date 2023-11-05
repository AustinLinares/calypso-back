import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Group } from './group.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column()
  minutes_per_session: number;

  @Column()
  cost_per_session: number;

  @ManyToOne(() => Group, (group) => group.services)
  group: Group;
}
