import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role } from 'src/role/enums/role.enum';
import { Roles } from 'src/role/decorators/role.decorator';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Post()
  create(@Body() group: CreateGroupDto) {
    return this.groupsService.create(group);
  }

  @Public()
  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() group: UpdateGroupDto) {
    return this.groupsService.update(id, group);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.remove(id);
  }
}
