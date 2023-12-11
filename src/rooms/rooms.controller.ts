import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/role/decorators/role.decorator';
import { Role } from 'src/role/enums/role.enum';
import { PutScheduleRoomDto } from './dto/put-schedule-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Put(':id/schedules')
  put(
    @Param('id', ParseIntPipe) id: number,
    @Body() PutScheduleRoomDto: PutScheduleRoomDto,
  ) {
    return this.roomsService.put(id, PutScheduleRoomDto);
  }
}
