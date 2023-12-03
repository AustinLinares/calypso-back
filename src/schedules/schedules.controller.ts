import {
  Controller,
  // Get,
  // Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
  // ParseIntPipe,
} from '@nestjs/common';
// import { SchedulesService } from './schedules.service';
// import { CreateScheduleDto } from './dto/create-schedule.dto';
// import { UpdateScheduleDto } from './dto/update-schedule.dto';
// import { Public } from 'src/auth/decorators/public.decorator';

@Controller('schedules')
export class SchedulesController {
  // constructor(private readonly schedulesService: SchedulesService) {}
  // @Post()
  // create(@Body() schedule: CreateScheduleDto) {
  //   return this.schedulesService.create(schedule);
  // }
  // @Public()
  // @Get()
  // findAll() {
  //   return this.schedulesService.findAll();
  // }
  // @Public()
  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.schedulesService.findOne(id);
  // }
  // @Public()
  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() schedule: UpdateScheduleDto,
  // ) {
  //   return this.schedulesService.update(id, schedule);
  // }
  // @Public()
  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.schedulesService.remove(id);
  // }
}
