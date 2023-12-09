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
import { Roles } from 'src/role/decorators/role.decorator';
import { Role } from 'src/role/enums/role.enum';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post()
  create(@Body() worker: CreateWorkerDto) {
    return this.workersService.create(worker);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Get()
  findAll() {
    return this.workersService.findAll();
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.workersService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() worker: UpdateWorkerDto,
  ) {
    return this.workersService.update(id, worker);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
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
