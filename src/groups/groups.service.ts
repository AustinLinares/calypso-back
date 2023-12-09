import { ServicesService } from 'src/services/services.service';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { Service } from 'src/services/entities/service.entity';

@Injectable()
export class GroupsService {
  private readonly relations = ['services'];

  constructor(
    @InjectRepository(Group) private readonly groupReposiory: Repository<Group>,
    @Inject(forwardRef(() => ServicesService))
    private readonly servicesService: ServicesService,
  ) {}

  async create(group: CreateGroupDto) {
    const groupFound = await this.groupReposiory.findOne({
      where: { name: group.name },
    });

    if (groupFound)
      throw new HttpException('Group already Exists', HttpStatus.CONFLICT);

    const services = await this.servicesService.getServicesByIds(
      group.services_ids,
    );

    const newGroup = this.groupReposiory.create(group);
    newGroup.services = services;

    return this.groupReposiory.save(newGroup);
  }

  findAll(complete: boolean = true) {
    return this.groupReposiory.find({
      relations: complete ? this.relations : [],
    });
  }

  async findOne(id: number, complete: boolean = true) {
    const groupFound = await this.groupReposiory.findOne({
      where: { id },
      relations: complete ? this.relations : [],
    });

    if (!groupFound)
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

    return groupFound;
  }

  async update(id: number, group: UpdateGroupDto) {
    const groupFound = await this.findOne(id);
    let servicesToAdd: Service[] = [];
    let filteredServices: Service[] = groupFound.services;

    if (group.name && groupFound.name !== group.name) {
      const isDuplicatedName = await this.groupReposiory.findOneBy({
        name: group.name,
      });

      if (isDuplicatedName)
        throw new HttpException('Group already exists', HttpStatus.CONFLICT);
    }

    if (group.add_services_ids) {
      servicesToAdd = await this.servicesService.getServicesByIds(
        group.add_services_ids,
      );
    }

    if (group.remove_services_ids) {
      filteredServices = groupFound.services.filter(
        (service) => !group.remove_services_ids.includes(service.id),
      );
    }

    const groupUpdated = this.groupReposiory.merge(groupFound, group);
    groupUpdated.services = [...filteredServices, ...servicesToAdd];

    return this.groupReposiory.save(groupUpdated);
  }

  async remove(id: number) {
    const result = await this.groupReposiory.delete({ id });

    if (result.affected === 0)
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
