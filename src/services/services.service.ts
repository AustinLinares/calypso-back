import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { In, Repository, IsNull } from 'typeorm';
import { GroupsService } from 'src/groups/groups.service';
import { Group } from 'src/groups/entities/group.entity';
import { WorkersService } from 'src/workers/workers.service';
import { Worker } from 'src/workers/entities/worker.entity';
import { RoomsService } from 'src/rooms/rooms.service';
import { Room } from 'src/rooms/entities/room.entity';

@Injectable()
export class ServicesService {
  private readonly relations = ['group', 'appointments', 'workers', 'rooms'];

  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly groupsService: GroupsService,
    @Inject(forwardRef(() => WorkersService))
    private readonly workersService: WorkersService,
    @Inject(forwardRef(() => RoomsService))
    private readonly roomsService: RoomsService,
  ) {}

  async create(service: CreateServiceDto) {
    const serviceFound = await this.serviceRepository.findOne({
      where: {
        name: service.name,
      },
      relations: this.relations,
    });
    let group: Group | null = null;
    let rooms: Room[] = [];
    let workers: Worker[] = [];

    if (serviceFound)
      throw new HttpException('Service already exists', HttpStatus.CONFLICT);

    if (service.group_id)
      group = await this.groupsService.findOne(service.group_id, false);

    if (service.rooms_ids)
      rooms = await this.roomsService.getRoomsByIds(service.rooms_ids);

    if (service.workers_ids)
      workers = await this.workersService.getByIds(service.workers_ids);

    const newService = this.serviceRepository.create(service);
    newService.group = group;
    newService.rooms = rooms;
    newService.workers = workers;

    return this.serviceRepository.save(newService);
  }

  findAll(complete: boolean = true) {
    return this.serviceRepository.find({
      relations: complete ? this.relations : [],
    });
  }

  async findOne(id: number, complete: boolean = true) {
    const serviceFound = await this.serviceRepository.findOne({
      where: { id },
      relations: complete ? this.relations : [],
    });

    if (!serviceFound)
      throw new HttpException('Service not Found', HttpStatus.NOT_FOUND);

    return serviceFound;
  }

  async update(id: number, service: UpdateServiceDto) {
    const serviceFound = await this.findOne(id);
    let roomsToAdd: Room[] = [];
    let filteredRooms: Room[] = serviceFound.rooms;
    let workersToAdd: Worker[] = [];
    let filteredWorkers: Worker[] = serviceFound.workers;

    if (service.name && serviceFound.name !== service.name) {
      const isDuplicatedName = await this.serviceRepository.findOneBy({
        name: service.name,
      });

      if (isDuplicatedName)
        throw new HttpException(
          'Already exists a service with the same name',
          HttpStatus.CONFLICT,
        );
    }

    if (
      service.group_id &&
      (serviceFound.group === null ||
        serviceFound.group.id !== service.group_id)
    ) {
      const group = await this.groupsService.findOne(service.group_id, false);
      serviceFound.group = group;
    }

    if (service.group_id === null) serviceFound.group = null;

    if (service.add_rooms_ids) {
      roomsToAdd = await this.roomsService.getRoomsByIds(service.add_rooms_ids);
    }

    if (service.remove_rooms_ids) {
      filteredRooms = serviceFound.rooms.filter(
        (room) => !service.remove_rooms_ids.includes(room.id),
      );
    }

    if (service.add_workers_ids) {
      workersToAdd = await this.workersService.getByIds(
        service.add_workers_ids,
      );
    }

    if (service.remove_workers_ids) {
      filteredWorkers = serviceFound.workers.filter(
        (worker) => !service.remove_workers_ids.includes(worker.id),
      );
    }

    const updatedService = this.serviceRepository.merge(serviceFound, service);
    updatedService.rooms = [...filteredRooms, ...roomsToAdd];
    updatedService.workers = [...filteredWorkers, ...workersToAdd];

    return this.serviceRepository.save(updatedService);
  }

  async remove(id: number) {
    const result = await this.serviceRepository.delete({ id });

    if (result.affected === 0)
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);

    return result;
  }

  async workers(id: number) {
    const service = await this.findOne(id);

    return service.workers;
  }

  getServicesByIds(ids: number[]) {
    return this.serviceRepository.findBy({ id: In(ids) });
  }

  async getServicesWithoutGroups() {
    const result = await this.serviceRepository.findBy({
      group: IsNull(),
    });

    return result;
  }
}
