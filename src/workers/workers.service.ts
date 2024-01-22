import { AuthService } from './../auth/auth.service';
import { RoomsSchedulesService } from './../rooms_schedules/rooms_schedules.service';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { Worker } from './entities/worker.entity';
import { ServicesService } from 'src/services/services.service';
import { Service } from 'src/services/entities/service.entity';
import { RoomsSchedule } from 'src/rooms_schedules/entities/rooms_schedule.entity';
import { genSecurePassword } from 'src/utils/credentialsFunctions';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class WorkersService {
  private readonly relations = ['schedules', 'services', 'room_schedules'];

  constructor(
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
    private readonly servicesService: ServicesService,
    private readonly roomsSchedulesService: RoomsSchedulesService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  async create(worker: CreateWorkerDto) {
    const workerFound = await this.workerRepository.findOne({
      where: [
        { email: worker.email, deleted_at: IsNull() },
        { phone: worker.phone, deleted_at: IsNull() },
      ],
    });

    if (workerFound)
      throw new HttpException(
        'Already exists a Worker with the same email or phone',
        HttpStatus.CONFLICT,
      );

    const foundServices = await this.servicesService.getServicesByIds(
      worker.services_ids,
    );
    const foundRoomSchedules = await this.roomsSchedulesService.getByIds(
      worker.rooms_schedules_ids,
    );

    const newPassword = genSecurePassword();

    const newWorker = this.workerRepository.create(worker);
    newWorker.hash_password = await this.authService.genHash(newPassword);
    newWorker.services = foundServices;
    newWorker.room_schedules = foundRoomSchedules;

    await this.mailService.sendNewWorkerEmail(newWorker, newPassword);

    return this.workerRepository.save(newWorker);
  }

  async findAll(complete: boolean = true, sensitive: boolean = false) {
    const result = await this.workerRepository.find({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone: true,
        email: true,
        is_available: true,
        created_at: true,
        deleted_at: true,
        speciality: true,
        presentation: true,
        role: true,
        hash_password: sensitive,
        reset_token: sensitive,
      },
      where: { deleted_at: IsNull() },
      relations: complete ? this.relations : [],
    });

    return result;
  }

  async findOne(
    id: number,
    complete: boolean = true,
    sensitive: boolean = false,
  ) {
    const workerFound = await this.workerRepository.findOne({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone: true,
        email: true,
        is_available: true,
        created_at: true,
        deleted_at: true,
        speciality: true,
        presentation: true,
        role: true,
        hash_password: sensitive,
        reset_token: sensitive,
      },
      where: { id, deleted_at: IsNull() },
      relations: complete ? this.relations : [],
    });

    if (!workerFound)
      throw new HttpException('Worker not found', HttpStatus.NOT_FOUND);

    return workerFound;
  }

  async update(id: number, worker: UpdateWorkerDto) {
    const workerFound = await this.findOne(id, true);
    let servicesToAdd: Service[] = [];
    let filteredServices: Service[] = workerFound.services;
    let roomsSchedulesToAdd: RoomsSchedule[] = [];
    let filteredRoomsSchedules: RoomsSchedule[] = workerFound.room_schedules;

    if (worker.phone && workerFound.phone !== worker.phone) {
      const workersWithSamePhone = await this.workerRepository.findOneBy({
        phone: worker.phone,
        deleted_at: IsNull(),
      });

      if (workersWithSamePhone)
        throw new HttpException(
          'That phone number is already on use',
          HttpStatus.CONFLICT,
        );
    }

    if (worker.email && workerFound.email !== worker.email) {
      const workersWithSameEmail = await this.workerRepository.findOneBy({
        email: worker.email,
        deleted_at: IsNull(),
      });

      if (workersWithSameEmail)
        throw new HttpException('Email is already on use', HttpStatus.CONFLICT);
    }

    if (worker.services_to_add) {
      servicesToAdd = await this.servicesService.getServicesByIds(
        worker.services_to_add,
      );
    }

    if (worker.services_to_delete) {
      filteredServices = workerFound.services.filter(
        (service) => !worker.services_to_delete.includes(service.id),
      );
    }

    if (worker.rooms_schedules_to_add) {
      roomsSchedulesToAdd = await this.roomsSchedulesService.getByIds(
        worker.rooms_schedules_to_add,
      );
    }

    if (worker.rooms_schedules_to_delete) {
      filteredRoomsSchedules = workerFound.room_schedules.filter(
        (roomSchedule) =>
          !worker.rooms_schedules_to_delete.includes(roomSchedule.id),
      );
    }

    const updatedWorker = this.workerRepository.merge(workerFound, worker);
    updatedWorker.services = [...filteredServices, ...servicesToAdd];
    updatedWorker.room_schedules = [
      ...filteredRoomsSchedules,
      ...roomsSchedulesToAdd,
    ];

    return this.workerRepository.save(updatedWorker);
  }

  async softDelete(id: number) {
    return this.workerRepository.softDelete(id);
  }

  async getServices(id: number) {
    const worker = await this.findOne(id);

    return worker.services;
  }

  async getSchedules(id: number) {
    const schedules = await this.roomsSchedulesService.getByWorkerId(id);

    return schedules;
  }

  getByIds(ids: number[]) {
    return this.workerRepository.findBy({
      id: In(ids),
    });
  }

  async getByEmail(email: string) {
    const workerFound = await this.workerRepository.findOne({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone: true,
        email: true,
        is_available: true,
        created_at: true,
        deleted_at: true,
        speciality: true,
        presentation: true,
        role: true,
        hash_password: true,
        reset_token: true,
      },
      where: {
        email,
        deleted_at: IsNull(),
      },
    });

    if (!workerFound)
      throw new HttpException('Worker not found', HttpStatus.NOT_FOUND);

    return workerFound;
  }

  async changePassword(id: number, password: string) {
    const workerFound = await this.findOne(id, false);

    const hash_password = await this.authService.genHash(password);
    workerFound.hash_password = hash_password;
    workerFound.reset_token = null;

    return this.workerRepository.save(workerFound);
  }
}
