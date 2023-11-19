import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupsService {
  private readonly relations = ['services'];

  constructor(
    @InjectRepository(Group) private readonly groupReposiory: Repository<Group>,
  ) {}

  async create(group: CreateGroupDto) {
    const groupFound = await this.groupReposiory.findOne({
      where: { name: group.name },
    });

    if (groupFound)
      throw new HttpException('Group already Exists', HttpStatus.CONFLICT);

    const newGroup = this.groupReposiory.create(group);

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
    const groupFound = await this.groupReposiory.findOneBy({
      id,
    });

    if (!groupFound)
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

    if (group.name && groupFound.name !== group.name) {
      const isDuplicatedName = await this.groupReposiory.findOneBy({
        name: group.name,
      });

      if (isDuplicatedName)
        throw new HttpException('Group already exists', HttpStatus.CONFLICT);
    }

    const groupUpdated = this.groupReposiory.merge(groupFound, group);

    return this.groupReposiory.save(groupUpdated);
  }

  async remove(id: number) {
    const result = await this.groupReposiory.delete({ id });

    if (result.affected === 0)
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
