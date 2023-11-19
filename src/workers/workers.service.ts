import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { Worker } from './entities/worker.entity';
import { ServicesService } from 'src/services/services.service';
import { Service } from 'src/services/entities/service.entity';

@Injectable()
export class WorkersService {
  private readonly relations = ['schedules', 'appointments', 'services'];

  constructor(
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
    private readonly servicesService: ServicesService,
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
      worker.services_id,
    );

    const newWorker = this.workerRepository.create(worker);
    newWorker.services = foundServices;

    return this.workerRepository.save(newWorker);
  }

  async findAll(complete: boolean = true) {
    const result = await this.workerRepository.find({
      where: { deleted_at: IsNull() },
      relations: complete ? this.relations : [],
    });

    return result;
  }

  async findOne(id: number, complete: boolean = true) {
    const workerFound = await this.workerRepository.findOne({
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
    let filteredServices: Service[] = [];

    if (!workerFound)
      throw new HttpException('Worker not found', HttpStatus.NOT_FOUND);

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

    if (worker.services_to_add)
      servicesToAdd = await this.servicesService.getServicesByIds(
        worker.services_to_add,
      );

    if (worker.services_to_delete)
      filteredServices = workerFound.services.filter(
        (service) => !worker.services_to_delete.includes(service.id),
      );

    const updatedWorker = this.workerRepository.merge(workerFound, worker);
    updatedWorker.services = [...filteredServices, ...servicesToAdd];

    return this.workerRepository.save(updatedWorker);
  }

  async softDelete(id: number) {
    return this.workerRepository.softDelete(id);
  }

  async isTimeAvailable(
    workerId: number,
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    const worker = await this.workerRepository.findOne({
      where: { id: workerId },
      relations: ['schedules'],
    });

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (!worker) return false;

    const hasConflict = worker.schedules.some((schedule) => {
      const scheduleStart = new Date(schedule.start_time);
      const scheduleEnd = new Date(schedule.end_time);

      return (
        (scheduleStart <= startDate && startDate < scheduleEnd) ||
        (scheduleStart < endDate && endDate <= scheduleEnd)
      );
    });

    return !hasConflict;
  }

  async getServices(id: number) {
    const worker = await this.findOne(id);

    return worker.services;
  }

  getWorkersByIds(ids: number[]) {
    return this.workerRepository.findBy({
      id: In(ids),
    });
  }
}
