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
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Public()
  @Post()
  create(@Body() worker: CreateWorkerDto) {
    return this.workersService.create(worker);
  }

  @Public()
  @Get()
  findAll() {
    return this.workersService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.workersService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() worker: UpdateWorkerDto,
  ) {
    return this.workersService.update(id, worker);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.workersService.softDelete(id);
  }

  @Public()
  @Get(':id/services')
  getServices(@Param('id', ParseIntPipe) id: number) {
    return this.workersService.getServices(id);
  }
}
