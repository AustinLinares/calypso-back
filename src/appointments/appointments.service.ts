import { RoomsService } from './../rooms/rooms.service';
import { ServicesService } from './../services/services.service';
import { WorkersService } from './../workers/workers.service';
import { UsersService } from './../users/users.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppointmentsService {
  private readonly relations = ['worker', 'service', 'user', 'room'];

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly usersService: UsersService,
    private readonly servicesService: ServicesService,
    private readonly workersService: WorkersService,
    private readonly roomsService: RoomsService,
  ) {}

  async create(appointment: CreateAppointmentDto) {
    const userFound = await this.usersService.findOne(
      appointment.user_id,
      false,
    );
    const serviceFound = await this.servicesService.findOne(
      appointment.service_id,
      false,
    );
    const workerFound = await this.workersService.findOne(
      appointment.worker_id,
      false,
    );
    const roomFound = await this.roomsService.findOne(
      appointment.room_id,
      false,
    );

    if (!workerFound.is_available)
      throw new HttpException(
        'Selected worker is not available for appointments',
        HttpStatus.BAD_REQUEST,
      );

    // Validar si la hora es valida en el horario del trabajador

    // Validar si la hora se cruza con algun appointment

    const isTimeAvailable = await this.workersService.isTimeAvailable(
      workerFound.id,
      appointment.start_time,
      appointment.end_time,
    );

    if (!isTimeAvailable)
      throw new HttpException(
        'Selected worker does not have available time for the appointment',
        HttpStatus.BAD_REQUEST,
      );

    // const hasConflictingAppointment =
    //   await this.usersService.hasConflictingAppointment(
    //     userFound.id,
    //     appointment.start_time,
    //     appointment.end_time,
    //   );

    // if (hasConflictingAppointment)
    //   throw new HttpException(
    //     'User already has an appointment at the selected time',
    //     HttpStatus.BAD_REQUEST,
    //   );

    const newAppointment = this.appointmentRepository.create(appointment);
    newAppointment.cost = serviceFound.cost_per_session * appointment.sessions;
    newAppointment.user = userFound;
    newAppointment.worker = workerFound;
    newAppointment.service = serviceFound;

    return this.appointmentRepository.save(newAppointment);
  }

  findAll(complete: boolean = true) {
    return this.appointmentRepository.find({
      relations: complete ? this.relations : [],
    });
  }

  async findOne(id: number, complete: boolean = true) {
    const appointmentFound = this.appointmentRepository.findOne({
      where: { id },
      relations: complete ? this.relations : [],
    });

    if (!appointmentFound)
      throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);

    return appointmentFound;
  }

  async updateState(id: number, appointment: UpdateAppointmentDto) {
    const appointmentFound = await this.appointmentRepository.findOneBy({
      id,
    });

    if (!appointmentFound)
      throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);

    const canceledAppointment = this.appointmentRepository.merge(
      appointmentFound,
      appointment,
    );

    return this.appointmentRepository.save(canceledAppointment);
  }

  async remove(id: number) {
    const result = await this.appointmentRepository.delete({ id });

    if (result.affected === 0)
      throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
