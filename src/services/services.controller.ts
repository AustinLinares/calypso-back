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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role } from 'src/role/enums/role.enum';
import { Roles } from 'src/role/decorators/role.decorator';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Post()
  create(@Body() service: CreateServiceDto) {
    return this.servicesService.create(service);
  }

  @Public()
  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Public()
  @Get('no-groups')
  getServicesWithoutGroups() {
    return this.servicesService.getServicesWithoutGroups();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() service: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, service);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.remove(id);
  }

  @Public()
  @Get(':id/workers')
  getWorkers(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.workers(id);
  }
}
