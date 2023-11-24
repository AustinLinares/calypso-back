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

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Public()
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

  @Public()
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() group: UpdateGroupDto) {
    return this.groupsService.update(id, group);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.remove(id);
  }
}
