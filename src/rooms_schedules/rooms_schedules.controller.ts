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
import { RoomsSchedulesService } from './rooms_schedules.service';
import { CreateRoomsScheduleDto } from './dto/create-rooms_schedule.dto';
import { UpdateRoomsScheduleDto } from './dto/update-rooms_schedule.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/role/decorators/role.decorator';
import { Role } from 'src/role/enums/role.enum';

@Controller('rooms-schedules')
export class RoomsSchedulesController {
  constructor(private readonly roomsSchedulesService: RoomsSchedulesService) {}

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Post()
  create(@Body() createRoomsScheduleDto: CreateRoomsScheduleDto) {
    return this.roomsSchedulesService.create(createRoomsScheduleDto);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Get()
  findAll() {
    return this.roomsSchedulesService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsSchedulesService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomsScheduleDto: UpdateRoomsScheduleDto,
  ) {
    return this.roomsSchedulesService.update(id, updateRoomsScheduleDto);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsSchedulesService.remove(id);
  }
}
