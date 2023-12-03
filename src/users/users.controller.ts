import { Roles } from './../role/decorators/role.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NewTokenDto } from './dto/new-token.dto';
import { UserAppointmentsDto } from './dto/user-appointments.dto';
import { Role } from 'src/role/enums/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Post()
  create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
    return this.usersService.update(id, user);
  }

  @Roles(Role.ADMIN, Role.MANAGER, Role.WORKER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Public()
  @Post('new-token')
  newToken(@Body() body: NewTokenDto) {
    return this.usersService.newToken(body);
  }

  @Public()
  @Post('appointments')
  userAppointments(@Body() body: UserAppointmentsDto) {
    return this.usersService.getAppointments(body);
  }
}
