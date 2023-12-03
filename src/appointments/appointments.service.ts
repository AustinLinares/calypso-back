import { areIntervalsOverlapping, isBefore } from 'date-fns';
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
import {
  dateFromHoursAndData,
  getDayMonthYearFromDate,
  parseDateStringToDate,
} from 'src/utils/timeFunctions';
import { AppointmentByDateAndUserDto } from './dto/appointment-by-date-and-user.dto';

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
    if (isBefore(parseDateStringToDate(appointment.date), new Date())) {
      throw new HttpException(
        'You cant create a appointment in the past',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user_date = parseDateStringToDate(appointment.date);
    const [day, month, year] = getDayMonthYearFromDate(user_date);

    const serviceFound = await this.servicesService.findOne(
      appointment.service_id,
    );

    const availableHours = await this.reservationService.availableCompleteHours(
      {
        date: appointment.date,
        service_id: serviceFound.id,
      },
    );

    const freeSlot = availableHours.find(
      (hour) => hour.start === appointment.start_time,
    );

    if (!freeSlot)
      throw new HttpException(
        'No space found for this date',
        HttpStatus.CONFLICT,
      );

    const roomFound = await this.roomsService.findOne(freeSlot.room_id, false);

    const user = await this.usersService.create({
      email,
      first_name,
      last_name,
      phone,
    });

    const splitedDate = appointment.date.split('-');
    const formatedDate = `${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}`;

    const appointmentsFound = await this.getByDateAndUser({
      date: formatedDate,
      user_id: user.id,
    });

    for (const appointmentFound of appointmentsFound) {
      if (
        areIntervalsOverlapping(
          {
            start: dateFromHoursAndData(
              appointmentFound.start_time,
              day,
              month,
              year,
            ),
            end: dateFromHoursAndData(
              appointmentFound.end_time,
              day,
              month,
              year,
            ),
          },
          {
            start: dateFromHoursAndData(
              appointment.start_time,
              day,
              month,
              year,
            ),
            end: dateFromHoursAndData(freeSlot.end, day, month, year),
          },
        )
      )
        throw new HttpException(
          'You cant have more than one appointment at the same time',
          HttpStatus.CONFLICT,
        );
    }

    const newAppointment = this.appointmentRepository.create(appointment);
    newAppointment.date = parseDateStringToDate(appointment.date);
    newAppointment.cost =
      serviceFound.cost_per_session * (appointment.sessions || 1);
    newAppointment.service = serviceFound;
    newAppointment.end_time = freeSlot.end;
    newAppointment.room = roomFound;
    newAppointment.user = user;

    this.mailService.sendNewAppointmentEmail(newAppointment);
    delete newAppointment.user.token;

    return this.appointmentRepository.save(newAppointment);
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

    const appointments = await this.appointmentRepository.find({
      relations: {
        room: true,
      },
      where: {
        room: {
          id: In(rooms_ids),
        },
      },
    });

    return appointments.filter(
      (appointment) => (appointment.date as unknown as string) === date,
    );
  }

  async getByDateAndUser(body: AppointmentByDateAndUserDto) {
    const { date, user_id } = body;

    const appointments = await this.appointmentRepository.find({
      where: {
        user: {
          id: user_id,
        },
      },
    });

    return appointments.filter(
      (appointment) => (appointment.date as unknown as string) === date,
    );
  }
}
