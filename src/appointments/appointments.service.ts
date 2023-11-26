import { MailService } from 'src/mail/mail.service';
import { ReservationService } from './../reservation/reservation.service';
import { RoomsService } from './../rooms/rooms.service';
import { ServicesService } from './../services/services.service';
import { UsersService } from './../users/users.service';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { In, Repository } from 'typeorm';
import { AppointmentByDateAndServiceDto } from './dto/appointment-by-date-and-service.dto';
import { parseDateStringToDate } from 'src/utils/timeFunctions';

@Injectable()
export class AppointmentsService {
  private readonly relations = ['service', 'user', 'room'];

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly usersService: UsersService,
    private readonly servicesService: ServicesService,
    private readonly roomsService: RoomsService,
    @Inject(forwardRef(() => ReservationService))
    private readonly reservationService: ReservationService,
    private readonly mailService: MailService,
  ) {}

  async create(appointment: CreateAppointmentDto) {
    const { email, first_name, last_name, phone } = appointment.user;
    const serviceFound = await this.servicesService.findOne(
      appointment.service_id,
    );

    console.log('Se envia: ', appointment.date, appointment.start_time);

    const availableHours = await this.reservationService.availableCompleteHours(
      {
        date: appointment.date,
        service_id: serviceFound.id,
      },
    );

    console.log(availableHours);

    const freeSlot = availableHours.find(
      (hour) => hour.start === appointment.start_time,
    );

    if (!freeSlot)
      throw new HttpException(
        'No space found for this date',
        HttpStatus.CONFLICT,
      );

    const roomFound = await this.roomsService.findOne(freeSlot.room_id, false);

    // const user = await this.usersService.create({
    //   email,
    //   first_name,
    //   last_name,
    //   phone,
    // });

    const newAppointment = this.appointmentRepository.create(appointment);
    newAppointment.date = parseDateStringToDate(appointment.date);
    newAppointment.cost =
      serviceFound.cost_per_session * (appointment.sessions || 1);
    newAppointment.service = serviceFound;
    newAppointment.end_time = freeSlot.end;
    newAppointment.room = roomFound;
    // newAppointment.user = user;

    // this.mailService.sendNewAppointmentEmail(newAppointment);

    // delete newAppointment.user.token;

    // return this.appointmentRepository.save(newAppointment);
  }

  findAll(complete: boolean = true) {
    return this.appointmentRepository.find({
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          token: false,
        },
      },
      relations: complete ? this.relations : [],
    });
  }

  async findOne(id: number, complete: boolean = true) {
    const appointmentFound = this.appointmentRepository.findOne({
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
        },
      },
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

  async getByDateAndRooms(body: AppointmentByDateAndServiceDto) {
    const { date, rooms_ids } = body;

    const transformedDate = parseDateStringToDate(date);

    return this.appointmentRepository.find({
      where: {
        date: transformedDate,
        room: {
          id: In(rooms_ids),
        },
      },
    });
  }
}
