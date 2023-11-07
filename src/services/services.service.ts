import { GroupsService } from './../groups/groups.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly groupsService: GroupsService,
  ) {}

  async create(service: CreateServiceDto) {
    const serviceFound = await this.serviceRepository.findOne({
      where: { name: service.name },
    });

    if (serviceFound)
      throw new HttpException('Service already exists', HttpStatus.CONFLICT);

    const group = await this.groupsService.findOne(service.group_id);

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    const newService = this.serviceRepository.create({
      ...service,
      group,
    });

    return this.serviceRepository.save(newService);
  }

  findAll() {
    return this.serviceRepository.find({
      relations: ['group', 'appointments'],
    });
  }

  async findOne(id: number) {
    const serviceFound = await this.serviceRepository.findOne({
      where: { id },
      relations: ['group', 'appointments'],
    });

    if (!serviceFound)
      throw new HttpException('Service not Found', HttpStatus.NOT_FOUND);

    return serviceFound;
  }

  async update(id: number, service: UpdateServiceDto) {
    const existingService = await this.serviceRepository.findOne({
      where: { id },
      relations: ['group'],
    });

    if (!existingService)
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);

    const group = await this.groupsService.findOne(service.group_id);

    if (!group)
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

    delete group.services;

    const updatedService = {
      ...existingService,
      ...service,
      group,
    };

    delete updatedService.group_id;

    return this.serviceRepository.save(updatedService);
  }

  async remove(id: number) {
    const result = await this.serviceRepository.delete({ id });

    if (result.affected === 0)
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
