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

@Controller('rooms-schedules')
export class RoomsSchedulesController {
  constructor(private readonly roomsSchedulesService: RoomsSchedulesService) {}

  @Public()
  @Post()
  create(@Body() createRoomsScheduleDto: CreateRoomsScheduleDto) {
    return this.roomsSchedulesService.create(createRoomsScheduleDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.roomsSchedulesService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsSchedulesService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomsScheduleDto: UpdateRoomsScheduleDto,
  ) {
    return this.roomsSchedulesService.update(id, updateRoomsScheduleDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsSchedulesService.remove(id);
  }
}
