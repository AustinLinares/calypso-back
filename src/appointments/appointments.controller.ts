import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
// import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/role/decorators/role.decorator';
import { Role } from 'src/role/enums/role.enum';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Public()
  @Post()
  create(@Body() appointment: CreateAppointmentDto) {
    return this.appointmentsService.create(appointment);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findOne(id);
  }

  @Public()
  @Patch(':id')
  changeState(
    @Param('id', ParseIntPipe) id: number,
    @Body() appointment: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updateState(id, appointment);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.remove(id);
  }
}
