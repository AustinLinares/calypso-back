import { User } from 'src/users/entities/user.entity';
import { Worker } from 'src/workers/entities/worker.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  start_time: Date;

  @Column({ type: 'datetime' })
  end_time: Date;

  @Column()
  sessions: number;

  @Column()
  cost: number;

  @Column()
  state: string;

  @Column({ nullable: true, type: 'text' })
  comment: string;

  @ManyToOne(() => Worker, (worker) => worker.appointments)
  worker: Worker;

  //   @ManyToOne(() => Service, (service) => service.id)
  //   service: Service;

  @ManyToOne(() => User, (user) => user.appointments)
  user: User; // client
}
