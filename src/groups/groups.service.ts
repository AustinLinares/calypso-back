import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupsService {
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

  findAll() {
    return this.groupReposiory.find({
      relations: ['services'],
    });
  }

  async findOne(id: number) {
    const groupFound = await this.groupReposiory.findOne({
      where: { id },
      relations: ['services'],
    });

    if (!groupFound)
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

    return groupFound;
  }

  async update(id: number, group: UpdateGroupDto) {
    const result = await this.groupReposiory.update({ id }, group);

    if (result.affected === 0)
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

    return this.groupReposiory.findOne({ where: { id } });
  }

  async remove(id: number) {
    const result = await this.groupReposiory.delete({ id });

    if (result.affected === 0)
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
